-- Create schema
CREATE SCHEMA IF NOT EXISTS secretarai;

CREATE SEQUENCE secretarai.account_id_seq;
CREATE SEQUENCE secretarai.legalese_summary_id_seq;
CREATE SEQUENCE secretarai.daily_schedule_id_seq;
CREATE SEQUENCE secretarai.schedule_event_id_seq;
CREATE SEQUENCE secretarai.bullet_type_id_seq;
CREATE SEQUENCE secretarai.note_id_seq;
CREATE SEQUENCE secretarai.note_reminder_id_seq;
CREATE SEQUENCE secretarai.job_context_id_seq;
CREATE SEQUENCE secretarai.job_context_prompts_id_seq;
CREATE SEQUENCE secretarai.conversation_id_seq;
CREATE SEQUENCE secretarai.message_id_seq;

-- account
CREATE TABLE secretarai.account (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.account_id_seq'),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(30) NOT NULL
);

-- legalese_summary
CREATE TABLE secretarai.legalese_summary (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.legalese_summary_id_seq'),
    page_url VARCHAR(300) NOT NULL,
    date_summarized TIMESTAMP NOT NULL,
    summary TEXT NOT NULL,
    legalese_input TEXT NOT NULL,
    account_id INT NOT NULL REFERENCES secretarai.account(id)
);

-- bullet_type
CREATE TABLE secretarai.bullet_type (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.bullet_type_id_seq'),
    name VARCHAR(15) NOT NULL
);

-- daily_schedule
CREATE TABLE secretarai.daily_schedule (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.daily_schedule_id_seq'),
    bullet_type_id INT NOT NULL REFERENCES secretarai.bullet_type(id),
    schedule_date TIMESTAMP NOT NULL,
    account_id INT NOT NULL REFERENCES secretarai.account(id)
);

-- schedule_event
CREATE TABLE secretarai.schedule_event (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.schedule_event_id_seq'),
    schedule_id INT NOT NULL REFERENCES secretarai.daily_schedule(id),
    event_name VARCHAR(50) NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    stop_datetime TIMESTAMP NOT NULL,
    note VARCHAR(50)
);

-- note_reminder
CREATE TABLE secretarai.note_reminder (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.note_reminder_id_seq'),
    reminder_time TIMESTAMP NOT NULL
);

-- note
CREATE TABLE secretarai.note (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.note_id_seq'),
    account_id INT NOT NULL REFERENCES secretarai.account(id),
    title VARCHAR(100) NOT NULL,
    note_content TEXT,
    reminder_id INT REFERENCES secretarai.note_reminder(id)
);

-- job_context
CREATE TABLE secretarai.job_context (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.job_context_id_seq'),
    job_name VARCHAR NOT NULL
);

-- job_context_prompts
CREATE TABLE secretarai.job_context_prompts (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.job_context_prompts_id_seq'),
    job_context_id INT NOT NULL REFERENCES secretarai.job_context(id),
    account_id INT REFERENCES secretarai.account(id),
    prompt TEXT NOT NULL
);

-- conversation
CREATE TABLE secretarai.conversation (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.conversation_id_seq'),
    account_id INT NOT NULL REFERENCES secretarai.account(id),
    title TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- message
CREATE TABLE secretarai.message (
    id INT PRIMARY KEY DEFAULT nextval('secretarai.message_id_seq'),
    conversation_id INT NOT NULL REFERENCES secretarai.conversation(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_conversation_id ON secretarai.message(conversation_id);
CREATE INDEX idx_message_conversation_created ON secretarai.message(conversation_id, created_at);
