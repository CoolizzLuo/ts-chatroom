type User = {
  id: string;
  userName: string;
  roomName: string;
};

class UserService {
  private userMap: Map<string, User>;

  constructor() {
    this.userMap = new Map();
  }

  addUser(user: User) {
    this.userMap.set(user.id, user);
  }

  removeUser(userId: string) {
    if (this.userMap.has(userId)) {
      this.userMap.delete(userId);
    }
  }

  getUser(userId: string) {
    if (this.userMap.has(userId)) {
      return this.userMap.get(userId);
    }
    return null;
  }

  userDataInfoHandler(id: string, userName: string, roomName: string): User {
    return {
      id,
      userName,
      roomName,
    };
  }
}

export default UserService;
