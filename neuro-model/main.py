from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import logging

# Настройка логгирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Модель данных для запроса
class TextRequest(BaseModel):
    text: str

# Сопоставление категорий и приоритетов
category_mapping = {
    "hardware": 0,
    "network": 1,
    "software": 2,
    "access": 3,
    "accounts": 4,
    "security": 5,
    "maintenance": 6,
    "undefined": 7
}

priority_mapping = {
    "low": 0,
    "medium": 1,
    "high": 2,
    "critical": 3
}

reverse_category_mapping = {v: k for k, v in category_mapping.items()}
reverse_priority_mapping = {v: k for k, v in priority_mapping.items()}

# Инициализация модели при старте
@app.on_event("startup")
async def load_model():
    global tokenizer, model

    try:
        logger.info("Загрузка обученной модели...")
        tokenizer = BertTokenizer.from_pretrained('./ticket_classifier')
        model = BertForSequenceClassification.from_pretrained('./ticket_classifier')
        model.eval()
        logger.info("Модель успешно загружена")
    except Exception as e:
        logger.error(f"Ошибка загрузки модели: {str(e)}")
        raise


@app.post("/predict")
async def predict(request: TextRequest):
    try:
        # Токенизация текста
        inputs = tokenizer(
            request.text,
            return_tensors="pt",
            truncation=True,
            max_length=512
        )

        # Предсказание категории
        with torch.no_grad():
            outputs = model(**inputs)

        # Обработка результатов для категории
        category_probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        predicted_category = torch.argmax(category_probs).item()
        category_confidence = category_probs[0][predicted_category].item()

        # Предсказание приоритета (добавляем вторую модель или расширяем текущую)
        priority_probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        predicted_priority = torch.argmax(priority_probs).item()
        priority_confidence = priority_probs[0][predicted_priority].item()

        return {
            "category": predicted_category,
            "category_name": reverse_category_mapping[predicted_category],
            "category_confidence": category_confidence,
            "priority": predicted_priority,
            "priority_name": reverse_priority_mapping[predicted_priority],
            "priority_confidence": priority_confidence,
            "text": request.text
        }

    except Exception as e:
        logger.error(f"Ошибка предсказания: {str(e)}")
        return {"error": str(e)}


@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "torch_version": torch.__version__,
        "model_ready": 'model' in globals()
    }
