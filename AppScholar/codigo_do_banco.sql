--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aluno_disciplina; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aluno_disciplina (
    aluno_id integer NOT NULL,
    disciplina_id integer NOT NULL,
    data_matricula timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.aluno_disciplina OWNER TO postgres;

--
-- Name: alunos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alunos (
    id integer NOT NULL,
    usuario_id integer,
    nome character varying(255) NOT NULL,
    matricula character varying(50) NOT NULL,
    curso character varying(100) NOT NULL,
    cidade character varying(100),
    estado character varying(2),
    curso_id integer,
    semestre integer
);


ALTER TABLE public.alunos OWNER TO postgres;

--
-- Name: alunos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alunos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.alunos_id_seq OWNER TO postgres;

--
-- Name: alunos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alunos_id_seq OWNED BY public.alunos.id;


--
-- Name: atividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atividades (
    id integer NOT NULL,
    disciplina_id integer,
    nome character varying(255) NOT NULL,
    peso_percentual numeric(5,2) DEFAULT 100.00
);


ALTER TABLE public.atividades OWNER TO postgres;

--
-- Name: atividades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.atividades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.atividades_id_seq OWNER TO postgres;

--
-- Name: atividades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.atividades_id_seq OWNED BY public.atividades.id;


--
-- Name: chamadas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chamadas (
    id integer NOT NULL,
    disciplina_id integer,
    aluno_id integer,
    data_aula date NOT NULL,
    presente boolean NOT NULL
);


ALTER TABLE public.chamadas OWNER TO postgres;

--
-- Name: chamadas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chamadas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chamadas_id_seq OWNER TO postgres;

--
-- Name: chamadas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chamadas_id_seq OWNED BY public.chamadas.id;


--
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    area character varying(100),
    duracao character varying(50),
    coordenador character varying(255),
    etec character varying(255),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(20),
    CONSTRAINT cursos_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Bacharelado'::character varying, 'Tecnólogo'::character varying, 'Técnico'::character varying, 'ETEC'::character varying])::text[])))
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- Name: cursos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cursos_id_seq OWNER TO postgres;

--
-- Name: cursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_id_seq OWNED BY public.cursos.id;


--
-- Name: disciplinas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disciplinas (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    carga_horaria integer NOT NULL,
    professor_id integer,
    curso character varying(100) NOT NULL,
    semestre integer,
    dia_semana integer,
    horario_inicio time without time zone,
    sala character varying(50),
    horario_fim time without time zone
);


ALTER TABLE public.disciplinas OWNER TO postgres;

--
-- Name: disciplinas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disciplinas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.disciplinas_id_seq OWNER TO postgres;

--
-- Name: disciplinas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disciplinas_id_seq OWNED BY public.disciplinas.id;


--
-- Name: notas_atividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notas_atividades (
    id integer NOT NULL,
    atividade_id integer,
    aluno_id integer,
    nota numeric(4,2) NOT NULL
);


ALTER TABLE public.notas_atividades OWNER TO postgres;

--
-- Name: notas_atividades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notas_atividades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notas_atividades_id_seq OWNER TO postgres;

--
-- Name: notas_atividades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notas_atividades_id_seq OWNED BY public.notas_atividades.id;


--
-- Name: professores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professores (
    id integer NOT NULL,
    usuario_id integer,
    nome character varying(255) NOT NULL,
    titulacao character varying(100),
    area character varying(100)
);


ALTER TABLE public.professores OWNER TO postgres;

--
-- Name: professores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.professores_id_seq OWNER TO postgres;

--
-- Name: professores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professores_id_seq OWNED BY public.professores.id;


--
-- Name: solicitacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitacoes (
    id integer NOT NULL,
    aluno_id integer,
    disciplina_id integer,
    tipo character varying(100) NOT NULL,
    status character varying(50) DEFAULT 'Pendente'::character varying,
    data_solicitacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    mensagem text,
    resposta text
);


ALTER TABLE public.solicitacoes OWNER TO postgres;

--
-- Name: solicitacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solicitacoes_id_seq OWNER TO postgres;

--
-- Name: solicitacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitacoes_id_seq OWNED BY public.solicitacoes.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    perfil character varying(50) NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_perfil_check CHECK (((perfil)::text = ANY ((ARRAY['aluno'::character varying, 'professor'::character varying, 'diretor'::character varying, 'master'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: alunos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos ALTER COLUMN id SET DEFAULT nextval('public.alunos_id_seq'::regclass);


--
-- Name: atividades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atividades ALTER COLUMN id SET DEFAULT nextval('public.atividades_id_seq'::regclass);


--
-- Name: chamadas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chamadas ALTER COLUMN id SET DEFAULT nextval('public.chamadas_id_seq'::regclass);


--
-- Name: cursos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id SET DEFAULT nextval('public.cursos_id_seq'::regclass);


--
-- Name: disciplinas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disciplinas ALTER COLUMN id SET DEFAULT nextval('public.disciplinas_id_seq'::regclass);


--
-- Name: notas_atividades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_atividades ALTER COLUMN id SET DEFAULT nextval('public.notas_atividades_id_seq'::regclass);


--
-- Name: professores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professores ALTER COLUMN id SET DEFAULT nextval('public.professores_id_seq'::regclass);


--
-- Name: solicitacoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes ALTER COLUMN id SET DEFAULT nextval('public.solicitacoes_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: aluno_disciplina aluno_disciplina_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aluno_disciplina
    ADD CONSTRAINT aluno_disciplina_pkey PRIMARY KEY (aluno_id, disciplina_id);


--
-- Name: alunos alunos_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_matricula_key UNIQUE (matricula);


--
-- Name: alunos alunos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_pkey PRIMARY KEY (id);


--
-- Name: atividades atividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atividades
    ADD CONSTRAINT atividades_pkey PRIMARY KEY (id);


--
-- Name: chamadas chamadas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chamadas
    ADD CONSTRAINT chamadas_pkey PRIMARY KEY (id);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id);


--
-- Name: disciplinas disciplinas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disciplinas
    ADD CONSTRAINT disciplinas_pkey PRIMARY KEY (id);


--
-- Name: notas_atividades notas_atividades_atividade_id_aluno_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_atividades
    ADD CONSTRAINT notas_atividades_atividade_id_aluno_id_key UNIQUE (atividade_id, aluno_id);


--
-- Name: notas_atividades notas_atividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_atividades
    ADD CONSTRAINT notas_atividades_pkey PRIMARY KEY (id);


--
-- Name: professores professores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professores
    ADD CONSTRAINT professores_pkey PRIMARY KEY (id);


--
-- Name: solicitacoes solicitacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: aluno_disciplina aluno_disciplina_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aluno_disciplina
    ADD CONSTRAINT aluno_disciplina_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.alunos(id) ON DELETE CASCADE;


--
-- Name: aluno_disciplina aluno_disciplina_disciplina_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aluno_disciplina
    ADD CONSTRAINT aluno_disciplina_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id) ON DELETE CASCADE;


--
-- Name: alunos alunos_curso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_curso_id_fkey FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON DELETE SET NULL;


--
-- Name: alunos alunos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: atividades atividades_disciplina_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atividades
    ADD CONSTRAINT atividades_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id) ON DELETE CASCADE;


--
-- Name: chamadas chamadas_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chamadas
    ADD CONSTRAINT chamadas_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.alunos(id) ON DELETE CASCADE;


--
-- Name: chamadas chamadas_disciplina_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chamadas
    ADD CONSTRAINT chamadas_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id) ON DELETE CASCADE;


--
-- Name: disciplinas disciplinas_professor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disciplinas
    ADD CONSTRAINT disciplinas_professor_id_fkey FOREIGN KEY (professor_id) REFERENCES public.professores(id) ON DELETE SET NULL;


--
-- Name: notas_atividades notas_atividades_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_atividades
    ADD CONSTRAINT notas_atividades_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.alunos(id) ON DELETE CASCADE;


--
-- Name: notas_atividades notas_atividades_atividade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_atividades
    ADD CONSTRAINT notas_atividades_atividade_id_fkey FOREIGN KEY (atividade_id) REFERENCES public.atividades(id) ON DELETE CASCADE;


--
-- Name: professores professores_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professores
    ADD CONSTRAINT professores_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: solicitacoes solicitacoes_aluno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES public.alunos(id) ON DELETE CASCADE;


--
-- Name: solicitacoes solicitacoes_disciplina_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

