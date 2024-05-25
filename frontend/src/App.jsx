import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMusicsFetch } from "./state/musicState";
import Home from "./components/Home";
import "./App.css";
import RootLayout from "./layout/RootLayout";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import MusicDetail from "./components/MusicDetail";
import EditPage from "./components/EditPage";
import CreatePage from "./components/CreatePage";
import AboutPage from "./components/about";
function App() {
  const musics = useSelector((state) => state.musics.musics);
  const dispatch = useDispatch();
  const [searchQuery, setSearchquery] = useState("");
  const handleSearch = (substring) => {
    setSearchquery(substring);
  };
  useEffect(() => {
    dispatch(getMusicsFetch());
  }, [dispatch]);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout handleSearch={handleSearch} />}>
        <Route index element={<Home searchQuery={searchQuery} />} />
        <Route path="/:_id" element={<MusicDetail />} />
        <Route path="/:_id/edit" element={<EditPage />} />
        <Route path="/add" element={<CreatePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
