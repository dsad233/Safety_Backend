import { UsersRepository } from "./users.repository";

export class UsersService {
  private readonly usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  // 마이 페이지 조회
  myPage = async (id: string) => {
    return this.usersRepository.myPage(id);
  };
}
