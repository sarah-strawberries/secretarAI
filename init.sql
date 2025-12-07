-- Create schema
CREATE SCHEMA IF NOT EXISTS secreterai;

CREATE SEQUENCE secreterai.account_id_seq;
CREATE SEQUENCE secreterai.legalese_summary_id_seq;
CREATE SEQUENCE secreterai.daily_schedule_id_seq;
CREATE SEQUENCE secreterai.schedule_event_id_seq;
CREATE SEQUENCE secreterai.bullet_type_id_seq;
CREATE SEQUENCE secreterai.note_id_seq;
CREATE SEQUENCE secreterai.note_reminder_id_seq;
CREATE SEQUENCE secreterai.job_context_id_seq;
CREATE SEQUENCE secreterai.job_context_prompts_id_seq;
CREATE SEQUENCE secreterai.conversation_id_seq;
CREATE SEQUENCE secreterai.message_id_seq;

-- account
CREATE TABLE secreterai.account (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.account_id_seq'),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(30) NOT NULL
);

-- legalese_summary
CREATE TABLE secreterai.legalese_summary (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.legalese_summary_id_seq'),
    page_url VARCHAR(300) NOT NULL,
    date_summarized TIMESTAMP NOT NULL,
    summary TEXT NOT NULL,
    legalese_input TEXT NOT NULL,
    account_id INT NOT NULL REFERENCES secreterai.account(id)
);

-- bullet_type
CREATE TABLE secreterai.bullet_type (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.bullet_type_id_seq'),
    name VARCHAR(15) NOT NULL
);

-- daily_schedule
CREATE TABLE secreterai.daily_schedule (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.daily_schedule_id_seq'),
    bullet_type_id INT NOT NULL REFERENCES secreterai.bullet_type(id),
    schedule_date TIMESTAMP NOT NULL,
    account_id INT NOT NULL REFERENCES secreterai.account(id)
);

-- schedule_event
CREATE TABLE secreterai.schedule_event (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.schedule_event_id_seq'),
    schedule_id INT NOT NULL REFERENCES secreterai.daily_schedule(id),
    event_name VARCHAR(50) NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    stop_datetime TIMESTAMP NOT NULL,
    note VARCHAR(50)
);

-- note_reminder
CREATE TABLE secreterai.note_reminder (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.note_reminder_id_seq'),
    reminder_time TIMESTAMP NOT NULL
);

-- note
CREATE TABLE secreterai.note (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.note_id_seq'),
    account_id INT NOT NULL REFERENCES secreterai.account(id),
    title VARCHAR(100) NOT NULL,
    note_content TEXT,
    reminder_id INT REFERENCES secreterai.note_reminder(id)
);

-- job_context
CREATE TABLE secreterai.job_context (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.job_context_id_seq'),
    job_name VARCHAR NOT NULL
);

-- job_context_prompts
CREATE TABLE secreterai.job_context_prompts (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.job_context_prompts_id_seq'),
    job_context_id INT NOT NULL REFERENCES secreterai.job_context(id),
    account_id INT REFERENCES secreterai.account(id),
    prompt TEXT NOT NULL
);

-- conversation
CREATE TABLE secreterai.conversation (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.conversation_id_seq'),
    account_id INT NOT NULL REFERENCES secreterai.account(id),
    title TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- message
CREATE TABLE secreterai.message (
    id INT PRIMARY KEY DEFAULT nextval('secreterai.message_id_seq'),
    conversation_id INT NOT NULL REFERENCES secreterai.conversation(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_conversation_id ON secreterai.message(conversation_id);
CREATE INDEX idx_message_conversation_created ON secreterai.message(conversation_id, created_at);
