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

    it("should register a user successfully", async function () {
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

    it("should fail to register user without a name", async function () {
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

    it("should fail to register user without an email", async function () {
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

    it("should fail to register user without a password", async function () {
        const userWithoutName = new User({
            name: "John",
            email: "john@example.com"
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

    it('should fail to save user with invalid email format', async () => {
        const userWithInvalidEmail = new User({
            name: 'John Doe',
            email: 'invalid-email',
            password: 'password123'
        });
        let err;

        try {
            await userWithInvalidEmail.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should fail to save duplicate email', async () => {
        const firstUser = new User({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        });
        await firstUser.save();

        const duplicateUser = new User({
            name: 'Jane Doe',
            email: 'johndoe@example.com',
            password: 'password456'
        });
        let err: any;

        try {
            await duplicateUser.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        if (err && typeof err === 'object' && 'code' in err) {
            expect(err.code).toBe(11000); // MongoDB duplicate key error code
        } else {
            fail('Expected error with code property');
        }
    });

    it('should trim name and email fields', async () => {
        const userWithUntrimmedFields = new User({
            name: '  John Doe  ',
            email: '  johndoe@example.com  ',
            password: 'password123'
        });
        const savedUser = await userWithUntrimmedFields.save();

        expect(savedUser.name).toBe('John Doe');
        expect(savedUser.email).toBe('johndoe@example.com');
    });

    it('should save email in lower case', async () => {
        const userWithUntrimmedFields = new User({
            name: 'John Doe',
            email: 'JOHNDOE@EXAMPLE.COM',
            password: 'password123'
        });
        const savedUser = await userWithUntrimmedFields.save();

        expect(savedUser.email).toBe('johndoe@example.com');
    });
});
