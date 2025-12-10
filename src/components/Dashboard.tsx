import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper } from "@mui/material";

const Dashboard = () => {

    const [createTitle, setCreateTitle] = useState("");
    const [createBody, setCreateBody] = useState("");


    const [updateId, setUpdateId] = useState(0);
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateBody, setUpdateBody] = useState("");
    const [updateState, setUpdateState] = useState(false);


    const [viewId, setViewId] = useState(0);

    const [posts, setPosts] = useState<any[]>([]);


    const fetchPosts = async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { title: createTitle, body: createBody };
        const response = await axios.post(
            "https://jsonplaceholder.typicode.com/posts",
            formData
        );
        const data = await response.data;
        setPosts([data, ...posts]);
        setCreateTitle("");
        setCreateBody("");
    };


    const handleDelete = async (id: number) => {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
        setPosts(posts.filter((post) => post.id !== id));
    };


    const handleUpdate = async (e: React.FormEvent, id: number) => {
        e.preventDefault();
        const formData = { title: updateTitle, body: updateBody };
        const response = await axios.put(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
            formData
        );
        const data = await response.data;
        setPosts(posts.map((post) => (post.id === id ? data : post)));


        setUpdateState(false);
        setUpdateId(0);
        setUpdateTitle("");
        setUpdateBody("");
    };

    const selectedPost = posts.find((p) => Number(p.id) === viewId);

    return (
        <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <Typography variant="h3" align="center" gutterBottom>
                Post Management Dashboard
            </Typography>

            <Card sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Create New Post
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            label="Title"
                            value={createTitle}
                            onChange={(e) => setCreateTitle(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Body"
                            value={createBody}
                            onChange={(e) => setCreateBody(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Create Post
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {selectedPost && (
                <Dialog open={true} onClose={() => setViewId(0)} fullWidth maxWidth="sm">
                    <DialogTitle>{selectedPost.title}</DialogTitle>
                    <DialogContent>
                        <Typography>{selectedPost.body}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewId(0)} color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <TableContainer component={Paper} sx={{ maxWidth: "90%", mx: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Body</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id} hover>
                                <TableCell>
                                    {updateState && updateId === post.id ? (
                                        <TextField
                                            value={updateTitle}
                                            onChange={(e) => setUpdateTitle(e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    ) : (
                                        post.title
                                    )}
                                </TableCell>
                                <TableCell>
                                    {updateState && updateId === post.id ? (
                                        <TextField
                                            value={updateBody}
                                            onChange={(e) => setUpdateBody(e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    ) : (
                                        post.body
                                    )}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                                >
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Delete
                                    </Button>
                                    {updateState && updateId === post.id ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={(e) => handleUpdate(e, post.id)}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => {
                                                setUpdateId(post.id);
                                                setUpdateState(true);
                                                setUpdateTitle(post.title);
                                                setUpdateBody(post.body);
                                            }}
                                        >
                                            Update
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setViewId(post.id)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Dashboard;
