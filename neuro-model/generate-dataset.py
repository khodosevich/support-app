import pandas as pd
import random

# Список категорий и приоритетов
categories = ['hardware', 'network', 'software', 'access', 'accounts',
              'security', 'maintenance', 'undefined']
priorities = ['low', 'medium', 'high', 'critical']
assignees = [40, 41, 42, 43, 44, 45, 46, 47]

# Генерация данных
data = []
for i in range(1, 1001):
    # Базовые комбинации категорий и проблем
    if i % 10 == 0:
        category = 'undefined'
        title = 'Неопределенная ошибка'
        desc = 'Ошибка без подробного описания'
    elif i % 9 == 0:
        category = 'maintenance'
        title = random.choice(['Профилактика', 'Обновление системы', 'Проверка оборудования'])
        desc = random.choice(['Требуется плановая проверка', 'Необходимо обновить ПО', 'Запуск диагностики'])
    elif i % 7 == 0:
        category = 'security'
        title = random.choice(['Подозрительная активность', 'Несанкционированный доступ', 'Проблемы с безопасностью'])
        desc = random.choice(['Обнаружена подозрительная активность', 'Попытка несанкционированного доступа',
                              'Проблемы с настройками безопасности'])
    elif i % 5 == 0:
        category = 'accounts'
        title = random.choice(['Проблемы с учетной записью', 'Создание нового аккаунта', 'Блокировка аккаунта'])
        desc = random.choice(
            ['Не удается создать учетную запись', 'Проблемы с доступом к аккаунту', 'Аккаунт заблокирован'])
    elif i % 4 == 0:
        category = 'access'
        title = random.choice(['Сброс пароля', 'Проблемы с доступом', 'Авторизация'])
        desc = random.choice(
            ['Не удается сбросить пароль', 'Ошибка при входе в систему', 'Проблемы с двухфакторной аутентификацией'])
    elif i % 3 == 0:
        category = 'software'
        title = random.choice(['Ошибка в программе', 'Проблемы с приложением', 'Не работает ПО'])
        desc = random.choice(['Программа не запускается', 'Ошибка при выполнении', 'Не удается установить обновление'])
    elif i % 2 == 0:
        category = 'network'
        title = random.choice(['Проблемы с сетью', 'Нет интернета', 'Ошибка подключения'])
        desc = random.choice(['Не работает интернет', 'Проблемы с Wi-Fi', 'Ошибка сетевого подключения'])
    else:
        category = 'hardware'
        title = random.choice(['Сломался компьютер', 'Не работает принтер', 'Проблемы с монитором'])
        desc = random.choice(['Устройство не включается', 'Оборудование не отвечает', 'Аппаратная ошибка'])

    # Определение приоритета и исполнителя
    if 'critical' in title.lower() or 'безопасност' in desc.lower():
        priority = 'critical'
    elif 'не включается' in desc.lower() or 'не работает' in desc.lower():
        priority = 'high'
    else:
        priority = random.choice(priorities)

    # Сопоставление исполнителя с категорией
    assignee_map = {
        'hardware': 43,
        'network': 46,
        'software': 45,
        'access': 41,
        'accounts': 47,
        'security': 40,
        'maintenance': 44,
        'undefined': 42
    }
    assignee_id = assignee_map.get(category, 42)

    data.append({
        'ticket_id': i,
        'title': title,
        'description': desc,
        'category': category,
        'priority': priority,
        'assignee_id': assignee_id
    })

# Создаем DataFrame
df = pd.DataFrame(data)

# Сохраняем в CSV
df.to_csv('tickets.csv', index=False)
print("Сгенерировано 1000 записей в tickets.csv")

# Пример первых 10 записей
print("\nПример данных:")
print(df.head(10).to_string(index=False))