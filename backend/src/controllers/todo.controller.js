import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import Todo from "../models/todo.model.js";
import { sendResponse } from "../utils/response.utils.js";

const createTodo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
        throw new ApiError(400, "Title is required");
    }

    const todo = await Todo.create({
        user: req.user._id,
        title,
        description: description || "",
    });

    return sendResponse(
        res,
        201,
        todo,
        "Todo created successfully"
    );
});

const getTodos = asyncHandler(async (req, res) => {
    const todos = await Todo.find({
        user: req.user._id,
    });

    if (todos.length === 0) {
        throw new ApiError(404, "Todos not found");
    }

    return sendResponse(
        res,
        200,
        todos,
        "Todos fetched successfully"
    );
});

const getTodoById = asyncHandler(async (req, res) => {
    const { todoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
        throw new ApiError(400, "Invalid todo id");
    }

    const todo = await Todo.findOne({
        _id: todoId,
        user: req.user._id,
    });

    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    return sendResponse(
        res,
        200,
        todo,
        "Todo fetched successfully"
    );
});

const updateTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
        throw new ApiError(400, "Invalid todo id");
    }

    if (!title || title.trim() === "") {
        throw new ApiError(400, "Title is required");
    }

    const todo = await Todo.findOneAndUpdate(
        {
            _id: todoId,
            user: req.user._id,
        },
        {
            $set: {
                title,
                description,
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    return sendResponse(
        res,
        200,
        todo,
        "Todo updated successfully"
    );
});

const toggleComplete = asyncHandler(async (req, res) => {
    const { todoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
        throw new ApiError(400, "Invalid todo id");
    }

    const todo = await Todo.findOne({
        _id: todoId,
        user: req.user._id,
    });

    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    todo.isCompleted = !todo.isCompleted;

    await todo.save();

    return sendResponse(
        res,
        200,
        todo,
        "Todo completion status toggled successfully"
    );
});

const deleteTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
        throw new ApiError(400, "Invalid todo id");
    }

    const todo = await Todo.findOneAndDelete({
        _id: todoId,
        user: req.user._id,
    });

    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    return sendResponse(
        res,
        200,
        {},
        "Todo deleted successfully"
    );
});

export {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    toggleComplete,
    deleteTodo,
};