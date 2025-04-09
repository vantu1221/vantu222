import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";

type Movies = {
  id: number;
  name: string;
  image: string;
  director: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
};

const getMovies = async (): Promise<Movies[]> => {
  const { data } = await axios.get('http://localhost:3000/movies');
  return data;
};

const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get('http://localhost:3000/categories');
  return data;
};

function HomepageMovies() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const deleteMovies = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://localhost:3000/movies/${id}`);
    },
    onSuccess: () => {
      alert('Xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  if (isLoading || isLoadingCategories) return <p>Đang tải...</p>;
  if (error) return <p>Có lỗi xảy ra!</p>;

  return (
    <Container>
      <h1 className="my-4 text-center">Danh Sách Phim</h1>
      <Button variant="success" href="movies-add" className="mb-3">
        Add Movies
      </Button>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Director</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {movies?.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>
                <img
                  src={p.image}
                  alt={p.name}
                  className="img-thumbnail"
                  style={{ width: "80px", height: "80px" }}
                />
              </td>
              <td>{p.director}</td>
              <td>
                {categories?.find((c) => c.id === p.categoryId)?.name || "Không xác định"}
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => navigate(`/admin/movies-detail/${p.id}`)}
                  className="me-2"
                >
                  Detail
                </Button>
                <Button
                  variant="warning"
                  onClick={() => navigate(`/admin/movies-edit/${p.id}`)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm("Bạn muốn xóa không?")) {
                      deleteMovies.mutate(p.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default HomepageMovies;
