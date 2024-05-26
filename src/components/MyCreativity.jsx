import React, {useEffect, useState} from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from "axios";
const MyCreativity = () => {

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
            <div>
                <button onClick={() => {
                    navigate('/createAuthor')
                }}>Создать новый профиль</button>
            </div>
                <p>Список ваших профилей:</p>
            <div className={"track-upload-form"}>
                {authors.map((author) => (
                    <div key={author.id}>
                        <p>{author.name}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default MyCreativity;