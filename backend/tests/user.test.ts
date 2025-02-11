import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/user.model";

describe("User Model Test", () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it("should register a user successfully", async function() {
        const validUser = new User({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "password123"
        });
        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(validUser.name);
        expect(savedUser.email).toBe(validUser.email);
        expect(savedUser.password).toBe(validUser.password);
        expect(savedUser.createdAt).toBeDefined();
        expect(savedUser.updatedAt).toBeDefined();
    });

    it("should fail to register user without a name", async function() {
        const userWithoutName = new User({
            email: "john@example.com",
            password: "password123"
        });
        let err;

        try {
            await userWithoutName.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it("should fail to register user without an email", async function() {
        const userWithoutName = new User({
            name: "John",
            password: "password123"
        });
        let err;

        try {
            await userWithoutName.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});
