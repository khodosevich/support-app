import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Загружаем модель и токенизатор
model = BertForSequenceClassification.from_pretrained("./ticket_classifier")
tokenizer = BertTokenizer.from_pretrained("./ticket_classifier")

model.eval()  # Переводим модель в режим оценки

# Пример входа (dummy input)
inputs = tokenizer(
    "Пример текста для классификации",
    return_tensors="pt",
    padding="max_length",
    truncation=True,
    max_length=512
)

# Экспорт в ONNX
torch.onnx.export(
    model,
    (inputs["input_ids"], inputs["attention_mask"]),
    "ticket_classifier.onnx",
    input_names=["input_ids", "attention_mask"],
    output_names=["logits"],
    dynamic_axes={
        "input_ids": {0: "batch_size", 1: "sequence_length"},
        "attention_mask": {0: "batch_size", 1: "sequence_length"},
        "logits": {0: "batch_size"},
    },
    opset_version=14
)

print("Модель успешно экспортирована в 'ticket_classifier.onnx'")
