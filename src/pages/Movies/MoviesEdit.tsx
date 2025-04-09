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
  categoryId: number; // ✅ Sửa thành categoryId
};

type Category = {
  id: number;
  name: string;
};

// API lấy chi tiết phim
const getMoviesDetail = async (id: string): Promise<MoviesInput> => {
  const { data } = await axios.get(`http://localhost:3000/movies/${id}`);
  return data;
};

// API cập nhật phim
const updateMovies = async ({ id, ...movie }: MoviesInput & { id: string }) => {
  return await axios.put(`http://localhost:3000/movies/${id}`, movie);
};

// API lấy danh sách thể loại
const fetchCategories = async () => {
  const { data } = await axios.get<Category[]>("http://localhost:3000/categories");
  return data;
};

function MoviesEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MoviesInput>();

  // Lấy dữ liệu phim
  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMoviesDetail(id as string),
    enabled: !!id,
  });

  // Lấy dữ liệu categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (movie) reset(movie);
  }, [movie, reset]);

  const mutation = useMutation({
    mutationFn: (data: MoviesInput) => updateMovies({ id: id as string, ...data }),
    onSuccess: () => {
      alert("🎉 Cập nhật phim thành công!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      navigate("/admin/movies-list");
    },
  });

  const onSubmitEdit: SubmitHandler<MoviesInput> = (data) => {
    data.categoryId = Number(data.categoryId); // ép chắc chắn
    mutation.mutate(data);
  };

  if (isLoading) return <p>⏳ Đang tải dữ liệu phim...</p>;
  if (isError) return <p>❌ Không thể tải dữ liệu phim. Vui lòng thử lại!</p>;

  return (
    <Container>
      <h1 className="my-4 text-center">Chỉnh sửa phim</h1>
      <Form onSubmit={handleSubmit(onSubmitEdit)}>
        <Form.Group className="mb-3">
          <Form.Label>Tên phim</Form.Label>
          <Form.Control
            type="text"
            {...register("name", { required: "Tên phim là bắt buộc" })}
          />
          {errors.name && <Alert variant="danger">{errors.name.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Link hình ảnh</Form.Label>
          <Form.Control
            type="text"
            {...register("image", { required: "Link hình ảnh là bắt buộc" })}
          />
          {errors.image && <Alert variant="danger">{errors.image.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đạo diễn</Form.Label>
          <Form.Control
            type="text"
            {...register("director", { required: "Đạo diễn là bắt buộc" })}
          />
          {errors.director && <Alert variant="danger">{errors.director.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thể loại</Form.Label>
          {isCategoriesLoading ? (
            <div>Đang tải thể loại...</div>
          ) : (
            <Form.Select {...register("categoryId", { required: "Thể loại là bắt buộc" })}>
              <option value="">-- Chọn thể loại --</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          )}
          {errors.categoryId && <Alert variant="danger">{errors.categoryId.message}</Alert>}
        </Form.Group>

        <Button type="submit" variant="primary" disabled={mutation.isPending}>
          {mutation.isPending ? "⏳ Đang cập nhật..." : "✅ Cập nhật phim"}
        </Button>
      </Form>
    </Container>
  );
}

export default MoviesEdit;
