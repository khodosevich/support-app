import pandas as pd
from sklearn.model_selection import train_test_split
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    Trainer,
    TrainingArguments,
    set_seed
)
from datasets import Dataset
import torch
import numpy as np
import json

# 1. Настройка окружения ======================================================
set_seed(42)  # Фиксируем seed для воспроизводимости

# Определяем устройство (MPS для Apple Silicon, CUDA для GPU, CPU для остальных)
device = torch.device(
    "mps" if torch.backends.mps.is_available() else
    "cuda" if torch.cuda.is_available() else
    "cpu"
)
print(f"Using device: {device}")

# 2. Загрузка и подготовка данных =============================================
# Замените 'tickets.csv' на ваш файл с данными
df = pd.read_csv('tickets.csv')

# Создаем маппинг для категорий
categories = df['category'].unique().tolist()
category_mapping = {cat: idx for idx, cat in enumerate(categories)}
df['label'] = df['category'].map(category_mapping)

# Разделяем данные на тренировочные и тестовые
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

# 3. Токенизация =============================================================
tokenizer = BertTokenizer.from_pretrained("DeepPavlov/rubert-base-cased")

def tokenize_function(examples):
    # Объединяем title и description для каждого примера
    texts = [f"{title} {desc}" for title, desc in zip(examples['title'], examples['description'])]
    return tokenizer(texts, padding="max_length", truncation=True, max_length=512)

# Конвертируем в Dataset и токенизируем
train_dataset = Dataset.from_pandas(train_df)
test_dataset = Dataset.from_pandas(test_df)

train_dataset = train_dataset.map(tokenize_function, batched=True)
test_dataset = test_dataset.map(tokenize_function, batched=True)

# 4. Инициализация модели ====================================================
model = BertForSequenceClassification.from_pretrained(
    "DeepPavlov/rubert-base-cased",
    num_labels=len(categories),
    ignore_mismatched_sizes=True  # Игнорируем предупреждения
).to(device)

# 5. Настройка обучения ======================================================
training_args = TrainingArguments(
    output_dir="./results",              # Директория для сохранения результатов
    evaluation_strategy="epoch",         # Оценка после каждой эпохи
    learning_rate=2e-5,                  # Скорость обучения
    per_device_train_batch_size=4,       # Размер батча (уменьшен для MPS)
    per_device_eval_batch_size=4,
    num_train_epochs=3,                  # Количество эпох
    weight_decay=0.01,                   # Вес для регуляризации
    logging_dir='./logs',                # Директория для логов
    logging_steps=10,                    # Частота логирования
    save_strategy="epoch",               # Сохранять после каждой эпохи
    load_best_model_at_end=True,         # Загружать лучшую модель в конце
    no_cuda=True,  # Отключить CUDA если нет GPU
    bf16=False,  # Использовать bfloat16 на MPS
    fp16=False,      # Использовать fp16 на CUDA
)

# 6. Обучение модели =========================================================
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

print("Starting training...")
trainer.train()

# 7. Сохранение модели =======================================================
model.save_pretrained("./ticket_classifier")
tokenizer.save_pretrained("./ticket_classifier")
print("Model saved to './ticket_classifier'")

with open("category_mapping.json", "w") as f:
    json.dump(category_mapping, f)

print("Saved category mapping to category_mapping.json")

# 8. Оценка модели ===========================================================
results = trainer.evaluate()
print("\nEvaluation results:")
print(f"Loss: {results['eval_loss']:.4f}")
print(f"Accuracy: {results['eval_accuracy']:.4f}" if 'eval_accuracy' in results else "Check metrics")
