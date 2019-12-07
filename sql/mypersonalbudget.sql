CREATE SEQUENCE public.category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: t_movement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.t_movement (
    id bigint NOT NULL,
    year integer,
    month integer,
    date date,
    amount double precision,
    label character varying(500),
    id_category bigint NOT NULL
);


--
-- Name: movement_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movement_id_seq OWNED BY public.t_movement.id;


--
-- Name: t_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.t_category (
    id bigint DEFAULT nextval('public.category_id_seq'::regclass) NOT NULL,
    name character varying(255),
    id_parent bigint,
    CONSTRAINT t_category_category_check CHECK ((name IS NOT NULL))
);


--
-- Name: t_movement id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_movement ALTER COLUMN id SET DEFAULT nextval('public.movement_id_seq'::regclass);


--
-- Name: t_movement movement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_movement
    ADD CONSTRAINT movement_pkey PRIMARY KEY (id);


--
-- Name: t_category t_category_category_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_category
    ADD CONSTRAINT t_category_category_key UNIQUE (name);


--
-- Name: t_category t_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_category
    ADD CONSTRAINT t_category_pkey PRIMARY KEY (id);


--
-- Name: t_movement t_movement_id_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_movement
    ADD CONSTRAINT t_movement_id_category_fkey FOREIGN KEY (id_category) REFERENCES public.t_category(id);


