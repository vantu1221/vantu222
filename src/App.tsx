import { useRoutes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/AdminLayout";
import Homepage from "./pages/foodsList";
import FoodsAdd from "./pages/foodsAdd";
import FoodsEdit from "./pages/foodsEdit";
import FoodDetail from "./pages/detailFoods";
import HomepageMovies from "./pages/Movies/MoviesList";
import MoviesAdd from "./pages/Movies/MoviesAdd";
import MoviesEdit from './pages/Movies/MoviesEdit';
import MoviesDetail from "./pages/Movies/MoviesDetail";
import Login from "./pages/users/login";
import Register from "./pages/users/register";

const routeConfigs = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "food-list", element: <Homepage /> },
      { path: "food-add", element: <FoodsAdd /> },
      { path: "food-edit/:id", element: <FoodsEdit /> },
      { path: "food-detail/:id", element: <FoodDetail /> },
      { path: "movies-list", element: <HomepageMovies /> },
      { path: "movies-add", element: <MoviesAdd /> },
      { path: "movies-edit/:id", element: <MoviesEdit /> },
      { path: "movies-detail/:id", element: <MoviesDetail /> }
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];

function App() {
  const routes = useRoutes(routeConfigs);
  return <div>{routes}</div>;
}

export default App;
