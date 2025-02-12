import { loginUser, logoutUser } from "../src/controllers/user.controller";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../src/models/user.model";

jest.mock("../src/models/user.model");
jest.mock("jsonwebtoken");

describe("Auth Controllers", () => {
    describe("loginUser", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;

        beforeEach(() => {
            req = {
                body: {
                    email: "john@test.com",
                    password: "password123"
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn()
            };
        });

        it("should authenticate user and set access-token cookie", async () => {
            const mockUser = {
                _id: "123",
                name: "Test User",
                email: "john@test.com",
                comparePassword: jest.fn().mockResolvedValue(true)
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

            await loginUser(req as Request, res as Response);

            expect(User.findOne).toHaveBeenCalledWith({ email: "john@test.com" });
            expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
            expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser._id }, expect.any(String), { expiresIn: "1h" });
            expect(res.cookie).toHaveBeenCalledWith("access-token", "fakeToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "prod",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                token: "fakeToken",
                user: { name: mockUser.name, email: mockUser.email }
            });
        });
    });
});
