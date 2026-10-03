--
-- PostgreSQL database dump
--

\restrict qRdcaIpf2MteUTY2ETm3mm7ZfYN1UUinCTUvBLntoo5EqA5ItHDCjXy71YmttJq

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6

-- Started on 2026-10-02 16:55:52 MSK

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
-- TOC entry 220 (class 1259 OID 16391)
-- Name: users; Type: TABLE; Schema: lipa; Owner: INSERT_DB_USER
--

CREATE TABLE lipa.users (
    id integer NOT NULL,
    username character varying(32) NOT NULL,
    password_hash character varying(64) CONSTRAINT users_password_not_null NOT NULL
);


ALTER TABLE lipa.users OWNER TO "INSERT_DB_USER";

--
-- TOC entry 3438 (class 0 OID 16391)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: lipa; Owner: INSERT_DB_USER
--

COPY lipa.users (id, username, password_hash) FROM stdin;
100	admin	5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
\.


--
-- TOC entry 3290 (class 2606 OID 16400)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: lipa; Owner: INSERT_DB_USER
--

ALTER TABLE ONLY lipa.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2026-10-02 16:55:52 MSK

--
-- PostgreSQL database dump complete
--

\unrestrict qRdcaIpf2MteUTY2ETm3mm7ZfYN1UUinCTUvBLntoo5EqA5ItHDCjXy71YmttJq

