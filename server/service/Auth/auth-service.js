import UserModel from "../../models/user-model.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import mailService from "./mail-service.js";
import TokenService from "./token-service.js";
import UserDto from "../../dtos/user-dto.js";
import tokenService from "./token-service.js";
import ApiError from "../../exceptions/api-error.js";
import tokenModel from "../../models/token-model.js";

class AuthService {
  async signup(name, email, password) {
    console.log("signup service");
    const candidateEmail = await UserModel.findOne({ email });
    if (candidateEmail) {
      throw ApiError.BadRequest(
        `User with such email: ${email} has already been created`
      );
    }
    const candidateName = await UserModel.findOne({ name });
    if (candidateName) {
      throw ApiError.BadRequest(
        `User with such name: ${name} has already been created`
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const activationLink = uuidv4();

    const user = await UserModel.create({
      name,
      email,
      password: hash,
      activationLink,
    });
    mailService.initTransportActivationMail();
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
  async activate(activationLink) {
    console.log("Activate service");
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Invalid validation url");
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    console.log("Login Service");
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User with such email wasn't found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Password isn't correct");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
  async getAllUsers() {
    console.log("get users service");
    const users = await UserModel.find();
    return users;
  }
}

export default new AuthService();
// TODO export in functions
