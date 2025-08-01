PGDMP                         }            support-app    15.10 (Postgres.app)    15.2 c    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    18053    support-app    DATABASE     �   CREATE DATABASE "support-app" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = icu LOCALE = 'en_US.UTF-8' ICU_LOCALE = 'en-US';
    DROP DATABASE "support-app";
                postgres    false            �            1259    18225    assignee_specializations    TABLE     �   CREATE TABLE public.assignee_specializations (
    specialization_id integer NOT NULL,
    assignee_id integer,
    category_id integer
);
 ,   DROP TABLE public.assignee_specializations;
       public         heap    postgres    false            �            1259    18224 .   assignee_specializations_specialization_id_seq    SEQUENCE     �   CREATE SEQUENCE public.assignee_specializations_specialization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 E   DROP SEQUENCE public.assignee_specializations_specialization_id_seq;
       public          postgres    false    233            �           0    0 .   assignee_specializations_specialization_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.assignee_specializations_specialization_id_seq OWNED BY public.assignee_specializations.specialization_id;
          public          postgres    false    232            �            1259    18069 	   assignees    TABLE     8  CREATE TABLE public.assignees (
    employee_id integer NOT NULL,
    user_id integer,
    specialization character varying(100) NOT NULL,
    skills text[],
    current_workload integer DEFAULT 0,
    max_workload integer DEFAULT 5,
    rating numeric(3,2) DEFAULT 5.0,
    avatar_url character varying(255)
);
    DROP TABLE public.assignees;
       public         heap    postgres    false            �            1259    18068    assignees_employee_id_seq    SEQUENCE     �   CREATE SEQUENCE public.assignees_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.assignees_employee_id_seq;
       public          postgres    false    217            �           0    0    assignees_employee_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.assignees_employee_id_seq OWNED BY public.assignees.employee_id;
          public          postgres    false    216            �            1259    18481    category_translations    TABLE     �   CREATE TABLE public.category_translations (
    category_en character varying(100) NOT NULL,
    category_ru character varying(100) NOT NULL,
    description_ru text
);
 )   DROP TABLE public.category_translations;
       public         heap    postgres    false            �            1259    18175 	   ml_models    TABLE     1  CREATE TABLE public.ml_models (
    model_id integer NOT NULL,
    name character varying(100) NOT NULL,
    version character varying(50) NOT NULL,
    purpose character varying(255) NOT NULL,
    accuracy numeric(5,4),
    last_trained timestamp without time zone,
    is_active boolean DEFAULT true
);
    DROP TABLE public.ml_models;
       public         heap    postgres    false            �            1259    18174    ml_models_model_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ml_models_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.ml_models_model_id_seq;
       public          postgres    false    227            �           0    0    ml_models_model_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.ml_models_model_id_seq OWNED BY public.ml_models.model_id;
          public          postgres    false    226            �            1259    18183    model_predictions    TABLE     U  CREATE TABLE public.model_predictions (
    prediction_id integer NOT NULL,
    ticket_id integer,
    model_id integer,
    predicted_category integer,
    predicted_priority character varying(20),
    suggested_assignee integer,
    confidence numeric(3,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 %   DROP TABLE public.model_predictions;
       public         heap    postgres    false            �            1259    18182 #   model_predictions_prediction_id_seq    SEQUENCE     �   CREATE SEQUENCE public.model_predictions_prediction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.model_predictions_prediction_id_seq;
       public          postgres    false    229            �           0    0 #   model_predictions_prediction_id_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.model_predictions_prediction_id_seq OWNED BY public.model_predictions.prediction_id;
          public          postgres    false    228            �            1259    18211    refresh_tokens    TABLE     �   CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer,
    token character varying(255) NOT NULL
);
 "   DROP TABLE public.refresh_tokens;
       public         heap    postgres    false            �            1259    18210    refresh_tokens_id_seq    SEQUENCE     �   CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.refresh_tokens_id_seq;
       public          postgres    false    231            �           0    0    refresh_tokens_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;
          public          postgres    false    230            �            1259    18093    ticket_categories    TABLE     �  CREATE TABLE public.ticket_categories (
    category_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    default_priority character varying(20),
    CONSTRAINT ticket_categories_default_priority_check CHECK (((default_priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[])))
);
 %   DROP TABLE public.ticket_categories;
       public         heap    postgres    false            �            1259    18092 !   ticket_categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ticket_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.ticket_categories_category_id_seq;
       public          postgres    false    219            �           0    0 !   ticket_categories_category_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.ticket_categories_category_id_seq OWNED BY public.ticket_categories.category_id;
          public          postgres    false    218            �            1259    18154    ticket_comments    TABLE     �   CREATE TABLE public.ticket_comments (
    comment_id integer NOT NULL,
    ticket_id integer,
    author_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_internal boolean DEFAULT false
);
 #   DROP TABLE public.ticket_comments;
       public         heap    postgres    false            �            1259    18153    ticket_comments_comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ticket_comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.ticket_comments_comment_id_seq;
       public          postgres    false    225            �           0    0    ticket_comments_comment_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.ticket_comments_comment_id_seq OWNED BY public.ticket_comments.comment_id;
          public          postgres    false    224            �            1259    18134    ticket_history    TABLE       CREATE TABLE public.ticket_history (
    history_id integer NOT NULL,
    ticket_id integer,
    changed_field character varying(50) NOT NULL,
    old_value text,
    new_value text,
    changed_by integer,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 "   DROP TABLE public.ticket_history;
       public         heap    postgres    false            �            1259    18133    ticket_history_history_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ticket_history_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.ticket_history_history_id_seq;
       public          postgres    false    223            �           0    0    ticket_history_history_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.ticket_history_history_id_seq OWNED BY public.ticket_history.history_id;
          public          postgres    false    222            �            1259    18105    tickets    TABLE     �  CREATE TABLE public.tickets (
    ticket_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying,
    priority character varying(20) DEFAULT 'low'::character varying,
    category_id integer,
    assigned_to integer,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resolved_at timestamp without time zone,
    estimated_time interval,
    actual_time interval,
    ai_confidence numeric(3,2),
    attachments text[],
    CONSTRAINT tickets_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[]))),
    CONSTRAINT tickets_status_check CHECK (((status)::text = ANY ((ARRAY['new'::character varying, 'assigned'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[])))
);
    DROP TABLE public.tickets;
       public         heap    postgres    false            �            1259    18104    tickets_ticket_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_ticket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.tickets_ticket_id_seq;
       public          postgres    false    221            �           0    0    tickets_ticket_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.tickets_ticket_id_seq OWNED BY public.tickets.ticket_id;
          public          postgres    false    220            �            1259    18055    users    TABLE       CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_active timestamp without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying, 'assignee'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    18054    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    215            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    214            �           2604    18228 *   assignee_specializations specialization_id    DEFAULT     �   ALTER TABLE ONLY public.assignee_specializations ALTER COLUMN specialization_id SET DEFAULT nextval('public.assignee_specializations_specialization_id_seq'::regclass);
 Y   ALTER TABLE public.assignee_specializations ALTER COLUMN specialization_id DROP DEFAULT;
       public          postgres    false    232    233    233            �           2604    18072    assignees employee_id    DEFAULT     ~   ALTER TABLE ONLY public.assignees ALTER COLUMN employee_id SET DEFAULT nextval('public.assignees_employee_id_seq'::regclass);
 D   ALTER TABLE public.assignees ALTER COLUMN employee_id DROP DEFAULT;
       public          postgres    false    216    217    217            �           2604    18178    ml_models model_id    DEFAULT     x   ALTER TABLE ONLY public.ml_models ALTER COLUMN model_id SET DEFAULT nextval('public.ml_models_model_id_seq'::regclass);
 A   ALTER TABLE public.ml_models ALTER COLUMN model_id DROP DEFAULT;
       public          postgres    false    226    227    227            �           2604    18186    model_predictions prediction_id    DEFAULT     �   ALTER TABLE ONLY public.model_predictions ALTER COLUMN prediction_id SET DEFAULT nextval('public.model_predictions_prediction_id_seq'::regclass);
 N   ALTER TABLE public.model_predictions ALTER COLUMN prediction_id DROP DEFAULT;
       public          postgres    false    228    229    229            �           2604    18214    refresh_tokens id    DEFAULT     v   ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);
 @   ALTER TABLE public.refresh_tokens ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231            �           2604    18096    ticket_categories category_id    DEFAULT     �   ALTER TABLE ONLY public.ticket_categories ALTER COLUMN category_id SET DEFAULT nextval('public.ticket_categories_category_id_seq'::regclass);
 L   ALTER TABLE public.ticket_categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    18157    ticket_comments comment_id    DEFAULT     �   ALTER TABLE ONLY public.ticket_comments ALTER COLUMN comment_id SET DEFAULT nextval('public.ticket_comments_comment_id_seq'::regclass);
 I   ALTER TABLE public.ticket_comments ALTER COLUMN comment_id DROP DEFAULT;
       public          postgres    false    225    224    225            �           2604    18137    ticket_history history_id    DEFAULT     �   ALTER TABLE ONLY public.ticket_history ALTER COLUMN history_id SET DEFAULT nextval('public.ticket_history_history_id_seq'::regclass);
 H   ALTER TABLE public.ticket_history ALTER COLUMN history_id DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    18108    tickets ticket_id    DEFAULT     v   ALTER TABLE ONLY public.tickets ALTER COLUMN ticket_id SET DEFAULT nextval('public.tickets_ticket_id_seq'::regclass);
 @   ALTER TABLE public.tickets ALTER COLUMN ticket_id DROP DEFAULT;
       public          postgres    false    221    220    221            �           2604    18058    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215            �          0    18225    assignee_specializations 
   TABLE DATA           _   COPY public.assignee_specializations (specialization_id, assignee_id, category_id) FROM stdin;
    public          postgres    false    233   
�       �          0    18069 	   assignees 
   TABLE DATA           �   COPY public.assignees (employee_id, user_id, specialization, skills, current_workload, max_workload, rating, avatar_url) FROM stdin;
    public          postgres    false    217   '�       �          0    18481    category_translations 
   TABLE DATA           Y   COPY public.category_translations (category_en, category_ru, description_ru) FROM stdin;
    public          postgres    false    234   ��       �          0    18175 	   ml_models 
   TABLE DATA           h   COPY public.ml_models (model_id, name, version, purpose, accuracy, last_trained, is_active) FROM stdin;
    public          postgres    false    227   ��       �          0    18183    model_predictions 
   TABLE DATA           �   COPY public.model_predictions (prediction_id, ticket_id, model_id, predicted_category, predicted_priority, suggested_assignee, confidence, created_at) FROM stdin;
    public          postgres    false    229   �       �          0    18211    refresh_tokens 
   TABLE DATA           <   COPY public.refresh_tokens (id, user_id, token) FROM stdin;
    public          postgres    false    231   6�       �          0    18093    ticket_categories 
   TABLE DATA           ]   COPY public.ticket_categories (category_id, name, description, default_priority) FROM stdin;
    public          postgres    false    219   �       �          0    18154    ticket_comments 
   TABLE DATA           m   COPY public.ticket_comments (comment_id, ticket_id, author_id, content, created_at, is_internal) FROM stdin;
    public          postgres    false    225   ��       �          0    18134    ticket_history 
   TABLE DATA           |   COPY public.ticket_history (history_id, ticket_id, changed_field, old_value, new_value, changed_by, changed_at) FROM stdin;
    public          postgres    false    223   ��       �          0    18105    tickets 
   TABLE DATA           �   COPY public.tickets (ticket_id, title, description, status, priority, category_id, assigned_to, created_by, created_at, resolved_at, estimated_time, actual_time, ai_confidence, attachments) FROM stdin;
    public          postgres    false    221   2�       �          0    18055    users 
   TABLE DATA           ]   COPY public.users (id, username, password, email, role, created_at, last_active) FROM stdin;
    public          postgres    false    215   ��       �           0    0 .   assignee_specializations_specialization_id_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('public.assignee_specializations_specialization_id_seq', 1, false);
          public          postgres    false    232            �           0    0    assignees_employee_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.assignees_employee_id_seq', 27, true);
          public          postgres    false    216            �           0    0    ml_models_model_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.ml_models_model_id_seq', 1, false);
          public          postgres    false    226            �           0    0 #   model_predictions_prediction_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.model_predictions_prediction_id_seq', 1, false);
          public          postgres    false    228            �           0    0    refresh_tokens_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 130, true);
          public          postgres    false    230            �           0    0 !   ticket_categories_category_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.ticket_categories_category_id_seq', 9, true);
          public          postgres    false    218            �           0    0    ticket_comments_comment_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.ticket_comments_comment_id_seq', 5, true);
          public          postgres    false    224            �           0    0    ticket_history_history_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.ticket_history_history_id_seq', 28, true);
          public          postgres    false    222            �           0    0    tickets_ticket_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.tickets_ticket_id_seq', 41, true);
          public          postgres    false    220            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 31, true);
          public          postgres    false    214            �           2606    18230 6   assignee_specializations assignee_specializations_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.assignee_specializations
    ADD CONSTRAINT assignee_specializations_pkey PRIMARY KEY (specialization_id);
 `   ALTER TABLE ONLY public.assignee_specializations DROP CONSTRAINT assignee_specializations_pkey;
       public            postgres    false    233            �           2606    18079    assignees assignees_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_pkey PRIMARY KEY (employee_id);
 B   ALTER TABLE ONLY public.assignees DROP CONSTRAINT assignees_pkey;
       public            postgres    false    217            �           2606    18081    assignees assignees_user_id_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_user_id_key UNIQUE (user_id);
 I   ALTER TABLE ONLY public.assignees DROP CONSTRAINT assignees_user_id_key;
       public            postgres    false    217            �           2606    18489 ;   category_translations category_translations_category_ru_key 
   CONSTRAINT     }   ALTER TABLE ONLY public.category_translations
    ADD CONSTRAINT category_translations_category_ru_key UNIQUE (category_ru);
 e   ALTER TABLE ONLY public.category_translations DROP CONSTRAINT category_translations_category_ru_key;
       public            postgres    false    234            �           2606    18487 0   category_translations category_translations_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY public.category_translations
    ADD CONSTRAINT category_translations_pkey PRIMARY KEY (category_en);
 Z   ALTER TABLE ONLY public.category_translations DROP CONSTRAINT category_translations_pkey;
       public            postgres    false    234            �           2606    18181    ml_models ml_models_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.ml_models
    ADD CONSTRAINT ml_models_pkey PRIMARY KEY (model_id);
 B   ALTER TABLE ONLY public.ml_models DROP CONSTRAINT ml_models_pkey;
       public            postgres    false    227            �           2606    18189 (   model_predictions model_predictions_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.model_predictions
    ADD CONSTRAINT model_predictions_pkey PRIMARY KEY (prediction_id);
 R   ALTER TABLE ONLY public.model_predictions DROP CONSTRAINT model_predictions_pkey;
       public            postgres    false    229            �           2606    18216 "   refresh_tokens refresh_tokens_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_pkey;
       public            postgres    false    231            �           2606    18218 '   refresh_tokens refresh_tokens_token_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_key UNIQUE (token);
 Q   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_token_key;
       public            postgres    false    231            �           2606    18103 ,   ticket_categories ticket_categories_name_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.ticket_categories
    ADD CONSTRAINT ticket_categories_name_key UNIQUE (name);
 V   ALTER TABLE ONLY public.ticket_categories DROP CONSTRAINT ticket_categories_name_key;
       public            postgres    false    219            �           2606    18101 (   ticket_categories ticket_categories_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.ticket_categories
    ADD CONSTRAINT ticket_categories_pkey PRIMARY KEY (category_id);
 R   ALTER TABLE ONLY public.ticket_categories DROP CONSTRAINT ticket_categories_pkey;
       public            postgres    false    219            �           2606    18163 $   ticket_comments ticket_comments_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_pkey PRIMARY KEY (comment_id);
 N   ALTER TABLE ONLY public.ticket_comments DROP CONSTRAINT ticket_comments_pkey;
       public            postgres    false    225            �           2606    18142 "   ticket_history ticket_history_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.ticket_history
    ADD CONSTRAINT ticket_history_pkey PRIMARY KEY (history_id);
 L   ALTER TABLE ONLY public.ticket_history DROP CONSTRAINT ticket_history_pkey;
       public            postgres    false    223            �           2606    18117    tickets tickets_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (ticket_id);
 >   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_pkey;
       public            postgres    false    221            �           2606    18067    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    215            �           2606    18063    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215            �           2606    18065    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    215                       2606    18231 B   assignee_specializations assignee_specializations_assignee_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignee_specializations
    ADD CONSTRAINT assignee_specializations_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.assignees(employee_id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.assignee_specializations DROP CONSTRAINT assignee_specializations_assignee_id_fkey;
       public          postgres    false    233    217    3544                       2606    18236 B   assignee_specializations assignee_specializations_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignee_specializations
    ADD CONSTRAINT assignee_specializations_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ticket_categories(category_id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.assignee_specializations DROP CONSTRAINT assignee_specializations_category_id_fkey;
       public          postgres    false    219    3550    233            �           2606    18082     assignees assignees_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.assignees DROP CONSTRAINT assignees_user_id_fkey;
       public          postgres    false    3540    215    217            �           2606    18087 !   assignees assignees_user_id_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.users(id);
 K   ALTER TABLE ONLY public.assignees DROP CONSTRAINT assignees_user_id_fkey1;
       public          postgres    false    215    217    3540            �           2606    18195 1   model_predictions model_predictions_model_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.model_predictions
    ADD CONSTRAINT model_predictions_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.ml_models(model_id);
 [   ALTER TABLE ONLY public.model_predictions DROP CONSTRAINT model_predictions_model_id_fkey;
       public          postgres    false    227    3558    229            �           2606    18200 ;   model_predictions model_predictions_predicted_category_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.model_predictions
    ADD CONSTRAINT model_predictions_predicted_category_fkey FOREIGN KEY (predicted_category) REFERENCES public.ticket_categories(category_id);
 e   ALTER TABLE ONLY public.model_predictions DROP CONSTRAINT model_predictions_predicted_category_fkey;
       public          postgres    false    229    219    3550            �           2606    18205 ;   model_predictions model_predictions_suggested_assignee_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.model_predictions
    ADD CONSTRAINT model_predictions_suggested_assignee_fkey FOREIGN KEY (suggested_assignee) REFERENCES public.assignees(employee_id);
 e   ALTER TABLE ONLY public.model_predictions DROP CONSTRAINT model_predictions_suggested_assignee_fkey;
       public          postgres    false    3544    217    229            �           2606    18190 2   model_predictions model_predictions_ticket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.model_predictions
    ADD CONSTRAINT model_predictions_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(ticket_id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.model_predictions DROP CONSTRAINT model_predictions_ticket_id_fkey;
       public          postgres    false    229    3552    221                        2606    18219 *   refresh_tokens refresh_tokens_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 T   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_user_id_fkey;
       public          postgres    false    215    231    3540            �           2606    18169 .   ticket_comments ticket_comments_author_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);
 X   ALTER TABLE ONLY public.ticket_comments DROP CONSTRAINT ticket_comments_author_id_fkey;
       public          postgres    false    215    3540    225            �           2606    18164 .   ticket_comments ticket_comments_ticket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(ticket_id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.ticket_comments DROP CONSTRAINT ticket_comments_ticket_id_fkey;
       public          postgres    false    3552    225    221            �           2606    18148 -   ticket_history ticket_history_changed_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_history
    ADD CONSTRAINT ticket_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id);
 W   ALTER TABLE ONLY public.ticket_history DROP CONSTRAINT ticket_history_changed_by_fkey;
       public          postgres    false    3540    215    223            �           2606    18143 ,   ticket_history ticket_history_ticket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_history
    ADD CONSTRAINT ticket_history_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(ticket_id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.ticket_history DROP CONSTRAINT ticket_history_ticket_id_fkey;
       public          postgres    false    3552    223    221            �           2606    18123     tickets tickets_assigned_to_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.assignees(employee_id) ON DELETE SET NULL;
 J   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_assigned_to_fkey;
       public          postgres    false    221    3544    217            �           2606    18118     tickets tickets_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ticket_categories(category_id);
 J   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_category_id_fkey;
       public          postgres    false    219    221    3550            �           2606    18128    tickets tickets_created_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
 I   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_created_by_fkey;
       public          postgres    false    221    3540    215            �      x������ � �      �   �  x�m�Mo1��ïX��e19"P�J4Y�Is����(��<^(E��5l�.�7��~gd
*�˃��|.sO6�g� ���~�F0�)�>��!�a�\�"�'+�i��3��z0�l�֡�_Ȗ���q�&����Zr6�i�C6������S!���|�/�$���!�7��i��%��|B�%�kYO�@vsC��p ����p3c\cCϸ=����V�U$�4��BΚ��uT6 5 ݄�y�}-�/�r1��9��m���EUҢ�[�,���W��u�<y����+���E�����%�#eԦ(P
����jk���5��d^�y�8Lq��d^����ǸM�Ǯ�+MR|/�֟�7�>b�m�TG�?sm�͍Aտk�	�	�V ��ό>)0Ğr����ut�����SPi�������\3�ve���u��~���*���      �   �  x�uR�JA<�|�B�C^�d� n � �L��`A0"�@\�f�>��du�jD��TUW�� j���,�;�hMmi�#*���yࠢ�5���1`9� X��Ғ68r�����oU?)�ӄ�v4t_�'��-QI�R� xX��1Y�o�-xjE/���OѰ� _A��Nt؍�N@O�Y��p�묙P�<�l�'{�-|MZ��OA��9O�ΪVI%n?��xj)��w�-�Oe��������BV����[��m�#e�����/��I�����X�u^~����}w|S��Q��(���L�L5��ݽoȾ�\� �>�c�{զTԺn����̜��8��0n�Y���������̊/��{��+��|R���dX1��a�c<���{aR
���U2� ���	D%�j�RbJ��Qr����]�*�L!����)[��	����<���B����}D�,4v�����46�^���0Mc��b;      �      x������ � �      �      x������ � �      �   �  x��ZG����^�zY���M̛�t���O����l���D���1\��UnE� ��Rě�4JE��K�&w6��eR��;�0?���{���(a�:M�b��+�:_�۵�%�4*�y�*m6\����z$CA��~�Z&1t+�0��6�	�3�㱝B0��b�?(�x*�&�M�>^�	���ba�<��]1����תˬT:��a�G�c�Y�#S� �i��gF�yq��-.N�
�J}*ayS�7��!��0��z� T�t�i+(�B�զg�v�<��\,T���~�\m֗g8�-	��5$8�X"$�~<�b����m���.[�����f�ggm��_��`��prB���O__�Z��nc��w5fja�CM��ߠ��d p���$����3}	Q�j���ΉjI�һ˴θW�Qi.�ZwB���}��w�4���Y�������6ܞ ���wrټT{[$Ѝ�o{�=��>5�(�p\}��I�t^C^'9���g~�Y��j�%����I椙�GW��J�r%�A�������Nk�ڤ��6ϔVU�t¹&]G������<{󃜩4)��+p{Ѫ��$���ʉ������4'DD- �*�X�>Ytj䙵B�/��5��7p [8��%�n��51'�3�ީ?��	�.�X����Ė;�X<��OY�?89���X�K�^�ŹK쐄v����:��)S�����n=k�]�|Җ���k;i�f�rS�G$ɜ7DU;'M��Y�x`�mX�5��9+W��i�< X�U`�h�ͻ�H�����q&���|2�����	�;x�%�<�����<�� �P�b��t�Q��Sg����vn�:���)n2�4��|����Zeͯx�Q��q1�k;K�@t/ա%/]��e���9�B�^B����1��OL��,z%2?�xw�g�gn}6�;�G������&/��V��W�7�h����e3?^*Y�Ryu��چ�%�١.j�1m³U�K�����f^��fN��l�WF�Ku��w�`m���C�K{�2���qx��cE�
�3�:��W8��/�Y{�,����G�đ�:w�H,�h��M		zo���P�_j���A��0i��:T���f�P��y���Wl�4[�MP@��md��U(�E�M+uE��o�3x8��ThaQ�l�5�\u���ѻ�5�w�&�]��w�^�B/�)N�v�_�����A� �_I��xd!��P�&�\��|���d���H�e��pF�w ���~���,���z�8]��[�lո���J��O��A�� 䱻��AH��GH�I#�G�y��[#��. R'S����߬����욻FBrϵ�����~=!�4E�`�:I��	��	4�<�> �f�6������uxwv���y v�J
؃�G�O��;F���<0�
΃7��Qe'i5�=�}��)���l�&b����/��S<� <Oʚ��<@Y���*�v�M}�/|�w��)�D��	��A�lx����"�#,Ol��� ,���	�-�*���ԍT���n#�g��n�X'�p�}��0z^��x|��4�n��ȹtO�H9Q�C�dfَK���|���G��g��_*�?<6��WOT�ث��d����aߊ}��]��9S$����
���
����\! ���R7�>��e�i��(4Ù}3�ؠuä���鈙/ �/���x�����X�E�Z�l���i�$XO��ݥ��'��ۃЌ�A�����ț8_.@�0�~V]Խ�j��[͑���ޭ��a3ra
���;@�)=����@~o.įQf���;^�6��X\��"a�;˾��p}�0���O)�#��&��@ʀ�ՕEir[����w�<�}�#���d���<(6�㊡>��k�'�IZ��y%��_kg�^����p90*�w3�J��θ�v ��ث�'+�S�7V��+P><د��s����`�N#7�A(iB\54�G��&�![u�j@V�O���4��M���ς�h)�v�)LV{,�dz�À�L>l��U3}(�����7>�����c�.yP�z�O�f��5�i�Gf�/4y\�8���
c̮�/\X�t����?	�E��ˎ���&�H`'��ؚ�s�B�g�'�/^�mՑ@y�/��-h�_���
���0ړ��4�+���:q�D|������e�|`_a�cԿBJ��W�x����c֬���I���.��Q:���%��A73�Y���!b�����i������im�	g����e�M���ơ |O⏛��}U������O���C���Jq~C9"ă�m�R��S���0v�Y]�|a�'N�0� �\��6�a�����7f�
*�T�B��c�&�"�"��s���K�7\�~?�)�~�t;�y(ɖ��Z�V�!���n�q�5�0Aȷ�t2>�o&sه�c�6#T:�#gf��}��iC�s��1g]AGѱ��ǷD[j���s��M��7f/���JQ�x�@;�E*M��F���X������v���Ux��{��d��o����t&G�q���D6��t�&qok]%{{kE~�<`~�Ξ�+�v6\ ��5�.�%����Mj�����ʘ���/'Y��܀m�����h�A}���o~�@�X������G�F��l�*+�-��^Dgҕ	!}Y���? }�������A>tÿ^Q�D�(�&W�t�]�����]����$�t�	R���V��ŊE���V G \ ޘ�]"�~�[�μv�n�P��.[P.
�u����Xx�׎i��ب��U�؇����W�y�aLs�T�%�.����nv�m�gM�ZQ��b�oa�ϋ�Bڤ�a\b��v/В�y�����5s]�+?���Ymʄʷ�B@V�R�pc��B9*$9�]:z��O4_����&�w})6%�"���h�1#��>�g�B��?��7�Ь�h���˕%<8���V�oCIl�BG�CuN�Ɩ��>�l����oF:���Hc�U�ؓ�g�;�:�QOSH ��˒Z�l��+
��yz~�9H��p D�x�p̺8�u�ݍU�N����!��k�C�膟|}��W��V!p_/��}���P�-Z)FP�4 }\3����&�o�.�K=�r�W�f'D��?� D����]�[�Ӆ����
	���5�(��������mEA���i�Mu�L=,Lx]�$��t �����Z_���Ύ"��N{�Y�7f� ��|�p��7�yUt���j�Y�n��"�Lc����C��ܻ��4�����p�0ϳ�A�(O��b�%�f�k�X+�Y�)�o��-�߹�[���W4H���C��W�^n��
�{�w�F%��Uc�a7�J=�`�>�t��V� ��7y'ҫ��Y�V�̲��      �   �  x�uS�jA<�~���E�&�D���*���7�@ ��X���X�Z�B���g'�ROwUuu��%.���5��a��U,�am�]<C͒W�gSut1��da��-:TC7���d�����/����j���J��5��;�M_O���#�o�_��싸��;������b�����Q�R��ް���`kI�e\pt���W,�k2���{�z�\j��&����%��,d�%@\$�O�i�m�o������W�b�ov'G��7'�c��m��aV�[��7�Oǳ��.�jnn��%��Vsʰ9��^,\���vK����LG��#/��h��C��3����ni��R�w���	�7)#O>����.��VI�F7f@��eC��c�R ��	�Z*D-��m_��.@��762 �B�÷QR�ŷ��[^BZ��t+EB������i�������|�u?��S���$��]��$�>1�}�6���fY�6ZZi      �   �   x�e���0E��*B�<��صpAB4 p�)E�B@ʉ��qG ���0���!� �b�
� 5�
C&��ZI+GO��e��/��;����o�q�A�K�B�ql���ի����u���Ξ����BW!f��Sl9�)#�%��e,ûA|w���xL	����;�n�LD      �   n  x����J�@��٧���qO�R� ��HS�މTM�B 7���g��P������N�8>�=0�=�>`�Pjf%��P����0����5JbE$z;�é?�k���_a�?�n{�Y�QCn�cA�,���%�?>����v\bi$���@v��x���e�Y���nǱ9v��� ~t\/�jF����ָ��~4��\j��+�@��xa2g$�ٽR�K�M���&)F��+��? ���6�X	�r`)+��	F�$^3H]�X#��/(��~9�|+XA�^	n蕡�i`����U�N-RJ�K�4���=�w�Q4�gR�Yi+y��t������3�ſG�c���C�<*�      �   S  x��U[NA�^�b �y���7�	����G$��I�D|�$B��cp��+��(ճ?fJ��wUW�T��}w=w�F����������ݸ�o3��ˑ���n�Ʈ��S�&�3&��c��׮O'�����·�V����~��l��%ɥY�z�L%/J�S�����e"+�)�J�ʦ?�!m�~�t��|�=�b��A��$b��<^EDp&d��T*�̋y<�T2qWx�qIR���_V���?��[q�@m:�q�zVADɑx��,��DDTBZSxv��!�⓻}*I)��
jK�U������m)����2
nP� �=Ԙ�WP�a&-�.@�� 4���N��F�m��>q�b�S)���sDW�_�/�Os��5|��yxD�Դ�`�������[T��^��	h�K���am��'!7
	mB��)�g�RzUh�%mK�SˍsM�S��}9�I��`�թ�M�j�ZUT�*>����_�.ЪQ��Ms�u����\��p��q��I��P������J�ǖ�(ȒtZ�j����ς���?��J}M5�.
3����,D}�uC�.bB��{�;C�Ӽ�a����a���z�h&t�W�����,\ܻ�PC7\�-���F4J���!�h��8��w0�&k4�:���# z���c�,9��6�5?���f$������-s�j��Fùy���]#�.J��Y��%j�R ���!�S}�p��!Y'�F��i+�)��k�{��͏��݇w�u��f����N���ɍ�t��\-z�F2Z�	#|�UCB}"���َ_������ȴ��ItM�7в�<_i�!�*2�u3m4,�t�      �   	  x����n�@���Sd�m�9s�eV4�$��z�e�I�\�ė:Ί˒5�x�
�H�&o�$�PB�f=����������(6�ȓ5�k�_��k�­G�$�mgI��a:ڮo���;(��'���Iq�wT�%n��~4BA2>�$��u�ֱ� K�#(C6ؘ��'�� �k�[&a�z�>.�/����}��D�irr-ˢ~,�:p��
���`<n��2�;�I}P_�s��Ȣnr5. ����D��]A����.1�m�~��,{�n/���8`AY�����Z�W���t�?��p��6�����~�w'�8T�ˤ�P��u�x���T��L�^ �Gռ���5��i�n��vg�̎������h�zhU�������8�U����� ��f8��`�L�?�E��b� a���_@��X0�[������e�`���O�M9�Ǔ���5 ]��L���@a��EM�_䡗Md��(�kf��g>�4F���e��u�E���8�dܯ�������%7���iQ3��^~-�,,#��7��\[���)�tx-
�����k"h�����Z��d���
�q�:v���!.PS����Š���O�<؀|��`�TU�pgNI�T��`���!�t�խ�`��ӕʁ�{�S�[R.hZ��m��Vo�u�x�>7�t��_��-{�C��+޼5���`�S��r���������nm�e���V���H���Tz�e��.�[��-���cd��7����     