import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Foods } from '../foods/foods';

function FoodDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setProduct] = useState<Foods | undefined>();

    const getDetail = async (id: string) => {
        try {
            const { data } = await axios.get(`http://localhost:3000/foods/${id}`);
            setProduct(data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        }
    };

    useEffect(() => {
        if (!id) return;
        getDetail(id);
    }, [id]);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Chi Tiết Sản Phẩm</h1>
            {food ? (
                <div className="card mx-auto" style={{ maxWidth: '400px' }}>
                    <img src={food.image} className="card-img-top" alt={food.name} />
                    <div className="card-body text-center">
                        <h5 className="card-title">{food.name}</h5>
                        <p className="card-text text-danger fw-bold">{food.price} VNĐ</p>
                        <button className="btn btn-primary" onClick={() => navigate(-1)}>
                            Quay lại
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center">Đang tải...</p>
            )}
        </div>
    );
}

export default FoodDetail;
