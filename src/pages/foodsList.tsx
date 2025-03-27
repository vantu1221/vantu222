import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";

type Food = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
const getFoods = async () : Promise<Food[]>=>{
    const { data } = await axios.get('http://localhost:3000/foods');
    return data;
}
function Homepage() {

    

   const queryClient =useQueryClient();
   const {data:foods,isLoading,error}=useQuery({

    queryKey:['foods'],
    queryFn:getFoods,
   });

    const deleteFoods = useMutation ({
        mutationFn: async(id:number)=>{
            if(window.confirm("Bạn muốn xóa không?")){
                await axios.delete(`http://localhost:3000/foods/${id}`);
            }
        },
        onSuccess:()=>{
            alert('Xóa thành công');
            queryClient.invalidateQueries({queryKey:['foods']});
        },
    });
    if(isLoading) return <p>Đang tải...</p>;
    if(error) return <p>Có lỗi</p>;
    return (
        <Container>
          <h1 className="my-4 text-center">Danh sách sản phẩm</h1>
          <Button variant="success" href="food-add" className="mb-3">
            Add Food
          </Button>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {foods?.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="img-thumbnail"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </td>
                  <td>{p.quantity}</td>
                  <td>
                    <Button variant="info" href={`food-detail/${p.id}`} className="me-2">
                      Detail
                    </Button>
                    <Button variant="warning" href={`food-edit/${p.id}`} className="me-2">
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteFoods.mutate(p.id)}
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

export default Homepage;
