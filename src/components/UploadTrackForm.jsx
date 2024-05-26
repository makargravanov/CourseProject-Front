import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
const UploadTrackForm = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const [realData, setRealData] = useState({});
    const [id , setId] = useState(0);
    const [authors, setAuthors] = useState([]);
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
                             navigate('/profile');
                         }}>Назад на главную</div>
                    <div className={"find-new"}
                         onClick={() => {
                             navigate('/creativity');
                         }}>Мои профили исполнителей</div>
                </div>
                <div className={"track-upload-form"}>
                <form method="post" action="http://localhost:8000/music/uploadTrack"
                  encType="multipart/form-data">
                    <label htmlFor="name">Название трека:</label>
                    <input type="text" id="name" name="name"/><br/>

                    <label htmlFor="authorId">Имя автора из ваших профилей:</label>
                    {authors.map(author => (
                        <div key={author.id}>
                            <input type="radio" id={`author${author.id}`} name="authorId" value={author.id}/>
                            <label htmlFor={`author${author.id}`}>{author.name}</label>
                        </div>
                    ))}
                    <input hidden={true} type="number" id="albumId" name="albumId" value = "0"/>
                    <label htmlFor="genre">Жанр:</label>
                    <input type="text" id="genre" name="genre"/><br/>

                    <label htmlFor="trackFile">Файл mp3 :</label>
                    <input type="file" id="trackFile" name="trackFile"/><br/>
                    <label htmlFor="lyricsFile">Текст песни:</label>
                    <input type="file" id="lyricsFile" name="lyricsFile"/><br/>

                    <label htmlFor="imageFile">Картинка 1 на 1:</label>
                    <input type="file" id="imageFile" name="imageFile"/><br/>

                    <button type="submit">Отправить</button>
            </form>
                </div>
            </div>

        );
}
export default UploadTrackForm;