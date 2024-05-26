import React, { useState } from "react";
import { useNavigate  } from 'react-router-dom';
import './styles/log-reg-style.css'


export const LogReg = () => {
    const [loginFormData, setLoginFormData] = useState({
        loglogin: '',
        logpassword: ''});
    const [registerFormData, setRegisterFormData] = useState({
        name: '',
        login: '',
        password: '',
        email: ''});
    const [showRegisterForm, setShowRegisterForm] = useState(false); // Создание состояния для отслеживания формы регистрации
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleLoginChange = (event) => {
        if (event.target.name === 'loglogin' || event.target.name === 'logpassword') {
            setLoginFormData(prevState => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
            console.log(loginFormData);
        }
    };

    const handleRegisterChange = (event) => {
        if (event.target.name === 'name' || event.target.name === 'login' || event.target.name === 'password' || event.target.name === 'email') {
            setRegisterFormData(prevState => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
            check();
            setErrors(errors);
        }
    };

    const handleFormToggle = () => {
        setShowRegisterForm(!showRegisterForm);
        setLoginFormData({
            loglogin: '',
            logpassword: ''}); // Очистка данных формы логина
        setRegisterFormData({
            name: '',
            login: '',
            password: '',
            email: ''}); // Очистка данных формы регистрации
    };
    const handleLogSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginFormData),
        })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('token', data.token); // Сохраняем токен в локальное хранилище
                navigate('/profile');
            })
            .catch(error => console.error('Error:', error));
    };


    const check = () => {

        if (registerFormData.name?.length < 1 || registerFormData.name?.length > 20) {
            errors.login = 'Name must be between 3 and 20 characters';
        }else{
            errors.login = '';
        }

        if (registerFormData.login?.length < 8 || registerFormData.login?.length > 20) {
            errors.login = 'Login must be between 8 and 20 characters';
        }else{
            errors.login = '';
        }

        if (registerFormData.password?.length < 8 || registerFormData.password?.length > 20) {
            errors.password = 'Password must be between 8 and 20 characters';
        }else{
            errors.password = '';
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(registerFormData.email)) {
            errors.email = 'Invalid email address';
        }else {
            errors.email = '';
        }
    }
    const handleRegSubmit = (event) => {
        event.preventDefault();
        let errors = {};
        check();
        if (Object.keys(errors).length === 0) {
            fetch('http://localhost:8000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerFormData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    // Обработка данных
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        } else {
            setErrors(errors);
        }
    };


    return (
        <div className="form-container">
            <div className="theta">θ</div>
            <div className="inside">
                <p>Teta. Music for you.</p>
            <div hidden={showRegisterForm}>
                <form onSubmit={handleLogSubmit}>
                    <input type="login" placeholder="Login" name="loglogin" onChange={handleLoginChange}/><br />
                    <input type="password" placeholder="Password" name="logpassword" onChange={handleLoginChange}/><br />
                    <button type="submit">Вход</button>
                </form>
                <p>Нет аккаунта?</p>
                <button onClick={() => handleFormToggle()}>Регистрация</button>
            </div>
            <div hidden={!showRegisterForm}>
                <form onSubmit={handleRegSubmit}>
                    <input type="name" placeholder="Name" name="name" onChange={handleRegisterChange}/><br />
                    {<p>{errors.name}</p>}
                    <input type="login" placeholder="Login" name="login" onChange={handleRegisterChange}/><br />
                    {<p>{errors.login}</p>}
                    <input type="password" placeholder="Password" name="password" onChange={handleRegisterChange}/><br />
                    {<p>{errors.password}</p>}
                    <input type="email" placeholder="youremail@example.com" name="email" onChange={handleRegisterChange}/><br />
                    {<p>{errors.email}</p>}
                    <button type="submit">Зарегистрироваться</button>
                </form>
                <p>Уже есть аккаунт?</p>
                <button onClick={() => handleFormToggle()}>Войдите здесь</button>
            </div>
            </div>
        </div>
    );
}