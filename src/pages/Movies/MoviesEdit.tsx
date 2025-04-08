import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type MoviesInput = {
  name: string;
  image: string;
  director: string;
};

// 🛠 API lấy chi tiết món ăn
const getMoviesDetail = async (id: string): Promise<MoviesInput> => {
  const { data } = await axios.get(`http://localhost:3000/movies/${id}`);
  return data;
};

// 🛠 API cập nhật món ăn
const updateMovies = async ({ id, ...food }: MoviesInput & { id: string }) => {
  return await axios.put(`http://localhost:3000/movies/${id}`, food);
};

function MoviesEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Sử dụng useForm từ react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MoviesInput>();

  // ✅ Lấy dữ liệu thực phẩm từ API
  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMoviesDetail(id as string),
    enabled: !!id,
  });
  useEffect(() => {
    if (movie) reset(movie);
  }, [movie, reset]);
  // ✅ Mutation để cập nhật món ăn
  const mutation = useMutation({
    mutationFn: (data: MoviesInput) => updateMovies({ id: id as string, ...data }),
    onSuccess: () => {
      alert("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["movies"] }); // Refresh danh sách
      navigate("/admin/movies-list");
    },
  });

  // 🛠 Xử lý submit form
  const onSubmitEdit: SubmitHandler<MoviesInput> = (data) => {
    mutation.mutate(data);
  };

  // ✅ Kiểm tra trạng thái tải dữ liệu
  if (isLoading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (isError) return <p>❌ Không thể tải dữ liệu. Vui lòng thử lại!</p>;

  return (
    <Container>
      <h1 className="my-4 text-center">Chỉnh sửa món ăn</h1>
      <Form onSubmit={handleSubmit(onSubmitEdit)}>
        <Form.Group className="mb-3">
          <Form.Label>Tên</Form.Label>
          <Form.Control type="text" {...register("name", { required: "Tên là bắt buộc" })} />
          {errors.name && <Alert variant="danger">{errors.name.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control type="text" {...register("image", { required: "Link hình ảnh là bắt buộc" })} />
          {errors.image && <Alert variant="danger">{errors.image.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tác giả</Form.Label>
          <Form.Control type="text" {...register("director", { required: "Giá món ăn là bắt buộc" })} />
          {errors.director && <Alert variant="danger">{errors.director.message}</Alert>}
        </Form.Group>


        <Button type="submit" variant="primary" disabled={mutation.isPending}>
             {mutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
        </Button>

      </Form>
    </Container>
  );
}

export default MoviesEdit;
