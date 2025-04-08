import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";

type movies = {
  id:string;
  name: string;
  image: string;
  director: string;
  };

// 🛠 API lấy chi tiết món ăn
const getMoviesDetail = async (id: string): Promise<movies> => {
  const { data } = await axios.get(`http://localhost:3000/movies/${id}`);
  return data;
};

function MoviesDetail() {
  const { id } = useParams<{ id:string }>();
  const navigate = useNavigate();

  // ✅ Sử dụng useQuery để lấy dữ liệu
  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMoviesDetail(id as string),
    enabled: !!id, // Chỉ gọi API khi có id
  });

  // ✅ Kiểm tra trạng thái tải dữ liệu
  if (isLoading) return <p className="text-center">⏳ Đang tải dữ liệu...</p>;
  if (isError) return <p className="text-center text-danger">❌ Không thể tải dữ liệu!</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Chi Tiết Sản Phẩm</h1>
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <img src={movie?.image} className="card-img-top" alt={movie?.name} />
        <div className="card-body text-center">
          <h5 className="card-title">{movie?.name}</h5>
          <p className="card-text text-danger fw-bold">{movie?.director}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoviesDetail;
