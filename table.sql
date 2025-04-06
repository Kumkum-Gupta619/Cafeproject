create table user(
    id int primary key AUTO_INCREMENT,
    name VARCHAR(250),
    contactNumber varchar(20),
    email varchar (50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

INSERT INTO mature
(rollno, name ,marks ,age)
VALUES 
(107 ,"bOB" ,  68, 100); 

SELECT * FROM student;

CREATE table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
);


create table product(

    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) nOT NULL,
    categoryId  intteger NOT NULL,
    description varchar(255),
    price integer,
    status varchar(20),
    primary key(id)


);