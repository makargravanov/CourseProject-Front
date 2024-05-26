import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const CreateAuthor = () => {
    const [realData, setRealData] = useState({});
    const [name, setName] = useState('');
    const [id , setId] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken= localStorage.getItem('token');
        if(!jwtToken) {
            return;
        }
        fetch('http://localhost:8000/user/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jwtToken)
        }).then(response => response.json())
            .then(userData => {
                console.log(userData);
                const realData = userData.body;
                setRealData(realData);

                if(realData && realData.name) {
                    console.log(realData.name);
                    console.log(realData.id);
                    setId(realData.id);
                    setName(realData.name);
                }
                findAuthors(realData.id);
            })
            .catch(error => navigate('/'));
        // Код, который нужно выполнить при монтировании компонента
        console.log('Component mounted');

        return () => {
            if(!jwtToken){
                navigate('/');
            }
            console.log('Component unmounted');
        };
    }, []); // Пустой массив зависимостей означает, что эффект будет выполнен только при монтировании и размонтировании


    const [authors, setAuthors] = useState([]);

    const findAuthors = async (id) => {
        try {
            const formData = new FormData();

            await formData.append('id', id);

            const response = await axios.post('http://localhost:8000/author/getAuthorsByUserId', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            await setAuthors(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
            setAuthors([]);
        }
    }

    return (
        <div className={"profile-container"}>
            <div className={"hello"}><p>Привет, {name} !   </p>
                <div className={"find-new"}
                     onClick={() => {
                         navigate('/tracksearch');
                     }}>Найти новые треки</div>
                <div className={"find-new"}
                     onClick={() => {
                         navigate('/upload');
                     }}>Загрузить трек в профиль</div>
                <div className={"find-new"}
                     onClick={() => {
                         navigate('/profile');
                     }}>Назад на главную</div>

            </div>
            <div className={"track-upload-form"}>
                <p>Создание профиля автора</p>
        <form method="post" action="http://localhost:8000/author/createAuthor"
              encType="multipart/form-data">

            <input type="text" id="token" name="token" hidden={true} value={localStorage.getItem('token')}/><br/>

            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name"/><br/>

            <label htmlFor="imageFile">Image File:</label>
            <input type="file" id="imageFile" name="imageFile"/><br/>

            <button type="submit">Отправить</button>
        </form>
            </div>

        </div>
    );
}
export default CreateAuthor;