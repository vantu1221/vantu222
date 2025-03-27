import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";

type Food = {
  id: string;
  name: string;
  price: number;
  image: string;
};

// 🛠 API lấy chi tiết món ăn
const getFoodDetail = async (id: string): Promise<Food> => {
  const { data } = await axios.get(`http://localhost:3000/foods/${id}`);
  return data;
};

function FoodDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ Sử dụng useQuery để lấy dữ liệu
  const { data: food, isLoading, isError } = useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodDetail(id as string),
    enabled: !!id, // Chỉ gọi API khi có id
  });

  // ✅ Kiểm tra trạng thái tải dữ liệu
  if (isLoading) return <p className="text-center">⏳ Đang tải dữ liệu...</p>;
  if (isError) return <p className="text-center text-danger">❌ Không thể tải dữ liệu!</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Chi Tiết Sản Phẩm</h1>
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <img src={food?.image} className="card-img-top" alt={food?.name} />
        <div className="card-body text-center">
          <h5 className="card-title">{food?.name}</h5>
          <p className="card-text text-danger fw-bold">{food?.price} VNĐ</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodDetail;
