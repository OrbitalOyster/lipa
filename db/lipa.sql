--
-- PostgreSQL database dump
--

\restrict nGlUitOSjDhCQejvJGpB0JGBXP2J57TBs6HLeFgnsHjrHOR1si0u4blokazbZy9

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-03 15:24:37 MSK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16390)
-- Name: lipa; Type: SCHEMA; Schema: -; Owner: INSERT_DB_USER
--

CREATE SCHEMA lipa;


ALTER SCHEMA lipa OWNER TO "INSERT_DB_USER";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16403)
-- Name: orgs; Type: TABLE; Schema: lipa; Owner: INSERT_DB_USER
--

CREATE TABLE lipa.orgs (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    password_hash character varying(64) NOT NULL,
    ord integer DEFAULT 1 NOT NULL,
    address character varying(256)
);


ALTER TABLE lipa.orgs OWNER TO "INSERT_DB_USER";

--
-- TOC entry 220 (class 1259 OID 16391)
-- Name: users; Type: TABLE; Schema: lipa; Owner: INSERT_DB_USER
--

CREATE TABLE lipa.users (
    id integer NOT NULL,
    name character varying(256),
    login character varying(32) CONSTRAINT users_username_not_null NOT NULL,
    password_hash character varying(64) CONSTRAINT users_password_not_null NOT NULL
);


ALTER TABLE lipa.users OWNER TO "INSERT_DB_USER";

--
-- TOC entry 3446 (class 0 OID 16403)
-- Dependencies: 221
-- Data for Name: orgs; Type: TABLE DATA; Schema: lipa; Owner: INSERT_DB_USER
--

COPY lipa.orgs (id, name, password_hash, ord, address) FROM stdin;
17000	Таверна "Ноги и брови"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	9	\N
1000	Бар "Утонувший огурец"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	1	\N
12000	Рюмочная "Доколе"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	4	\N
13000	Салун "Вой на болотах"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	5	\N
14000	Салун "Корова на льду"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	6	\N
15000	Таверна "Здесь рыбы нет"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	7	\N
16000	Таверна "Минное поле"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	8	\N
18000	Таверна "Пол-литра"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	10	\N
19000	Трактир "Бес в ребро"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	11	\N
20000	Трактир "Старый гремлин"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	13	\N
21000	Яхт-клуб "Треугольник печали"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	14	\N
22000	Бар "Девять из десяти"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	15	\N
4000	Конюшня "Конечно"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	17	\N
5000	Корчма "Косой банан"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	18	\N
6000	Корчма "Три орка"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	19	\N
7000	Парная "Ирония судьбы"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	20	\N
8000	Парная "Копытная"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	21	\N
9000	Парная "Он сам пришёл"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	22	\N
10000	Пельменная "Жир на боках"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	12	\N
11000	Пельменная "Судный день"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	16	\N
2000	Варьете "Силь-ву-пле"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	2	\N
3000	Варьете "Цыган не заказывали"	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8	3	\N
\.


--
-- TOC entry 3445 (class 0 OID 16391)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: lipa; Owner: INSERT_DB_USER
--

COPY lipa.users (id, name, login, password_hash) FROM stdin;
100	Administrator	admin	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
200	Regular user	user	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
\.


--
-- TOC entry 3297 (class 2606 OID 16410)
-- Name: orgs orgs_pkey; Type: CONSTRAINT; Schema: lipa; Owner: INSERT_DB_USER
--

ALTER TABLE ONLY lipa.orgs
    ADD CONSTRAINT orgs_pkey PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 16400)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: lipa; Owner: INSERT_DB_USER
--

ALTER TABLE ONLY lipa.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2026-11-03 15:24:37 MSK

--
-- PostgreSQL database dump complete
--

\unrestrict nGlUitOSjDhCQejvJGpB0JGBXP2J57TBs6HLeFgnsHjrHOR1si0u4blokazbZy9
