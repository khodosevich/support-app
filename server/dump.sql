CREATE TABLE category_translations (
                                       category_en VARCHAR(100) PRIMARY KEY,
                                       category_ru VARCHAR(100) UNIQUE NOT NULL,
                                       description_ru TEXT
);

INSERT INTO category_translations (category_en, category_ru, description_ru) VALUES
                                                                                 ('security', 'Безопасность', 'подозрительная активность, сброс паролей'),
                                                                                 ('access', 'Доступ / авторизация', 'проблемы с входом, правами'),
                                                                                 ('undefined', 'Не удалось выяснить', 'Задачи, которые получили данный статус, не могут быть оценены модель. Администратор должен сам выставить категорию сам'),
                                                                                 ('hardware', 'Оборудование (hardware)', 'поломки ПК, мониторов, принтеров'),
                                                                                 ('maintenance', 'Обслуживание / профилактика', 'плановые заявки'),
                                                                                 ('software', 'ПО', 'Задачи, связанные с ПО для сотрудников.'),
                                                                                 ('network', 'Сеть', 'Задачи связанные с сетью компании.'),
                                                                                 ('accounts', 'Учетные записи / ПО', 'установка, удаление, лицензии');


-- Установка специализаций и навыков сотрудникам

UPDATE assignees
SET specialization = 'hardware',
    skills = ARRAY['PC', 'Printers', 'Diagnostics']
WHERE user_id = 24;

UPDATE assignees
SET specialization = 'software',
    skills = ARRAY['Windows', 'Office', 'Installations']
WHERE user_id = 25;

UPDATE assignees
SET specialization = 'network',
    skills = ARRAY['Switches', 'VPN', 'Wi-Fi', 'Firewall']
WHERE user_id = 26;

UPDATE assignees
SET specialization = 'software',
    skills = ARRAY['Linux', 'Terminal', 'Scripting']
WHERE user_id = 28;

UPDATE assignees
SET specialization = 'security',
    skills = ARRAY['Account Recovery', 'Phishing Detection', 'Audit']
WHERE user_id = 31;



-- === USERS ===
INSERT INTO users (id, username, password, email, role) VALUES
                                                            (40, 'sec_admin',     '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'sec_admin@example.com', 'assignee'),
                                                            (41, 'auth_specialist', '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'auth@example.com', 'assignee'),
                                                            (42, 'generalist',    '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'general@example.com', 'assignee'),
                                                            (43, 'hw_tech',       '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'hardware@example.com', 'assignee'),
                                                            (44, 'maint_eng',     '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'maintenance@example.com', 'assignee'),
                                                            (45, 'sw_guru',       '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'software@example.com', 'assignee'),
                                                            (46, 'net_master',    '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'network@example.com', 'assignee'),
                                                            (47, 'acc_mgr',       '$2b$10$oaw4x2RBHhGUiprxLsoio.krlLyXE1Zpy5HF.nhjOXbqxKpuWRZcy', 'accounts@example.com', 'assignee');

-- === ASSIGNEES ===
INSERT INTO assignees (user_id, specialization, skills, current_workload, max_workload, rating)
VALUES
    (40, 'security',     ARRAY['Audit', 'Phishing Detection', 'Password Reset'], 0, 5, 4.9),
    (41, 'authorization',ARRAY['SSO', 'LDAP', 'Access Rights'], 0, 5, 4.7),
    (42, 'undefined',    ARRAY['General Troubleshooting', 'Investigation'], 0, 5, 4.5),
    (43, 'hardware',     ARRAY['Diagnostics', 'PC Repair', 'Printers'], 0, 5, 5.0),
    (44, 'maintenance',  ARRAY['Routine Checks', 'System Cleanup'], 0, 5, 4.6),
    (45, 'software',     ARRAY['Installations', 'MS Office', 'Troubleshooting'], 0, 5, 4.8),
    (46, 'network',      ARRAY['VPN', 'Wi-Fi', 'Routing', 'Firewall'], 0, 5, 4.9),
    (47, 'accounts',     ARRAY['User Setup', 'Licenses', 'Deactivation'], 0, 5, 4.7);

