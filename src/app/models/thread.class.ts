export class Thread {
  id: string;
  userId: string;
  creationDate: Date;
  message: string;
  comments: number;
  lastComment: Date;
  img: string;
  reactions: [{ id: string, users: string[] }];
  users: string[];


  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.userId = obj ? obj.userId : '';
    this.creationDate = obj ? obj.creationDate : new Date();
    this.message = obj ? obj.message : '';
    this.comments = obj ? obj.comments : 0;
    this.lastComment = obj ? obj.lastComment : new Date();
    this.img = obj ? obj.img : '';
    this.reactions = obj ? obj.reactions : [];
    this.users = obj ? obj.users : [];
  }

  toJson() {
    return {
      userId: this.userId,
      creationDate: this.creationDate,
      message: this.message,
      comments: this.comments,
      lastComment: this.lastComment,
      img: this.img,
      reactions: JSON.stringify(this.reactions),
      users: this.users
    };
  }

  evaluateThreadCases(emoji: string, currentUserId: string) {
    if (this.isEmojiAlreadyByMe(emoji, currentUserId))
      this.removeReaction(currentUserId, this.getEmojiIndex(emoji));
    else if (this.getEmojiCount(currentUserId) > 2) { }
    else if (this.getEmojiIndex(emoji) != -1)
      this.addCurrentUserToReaction(this.getEmojiIndex(emoji), currentUserId);
    else if (this.getEmojiIndex(emoji) == -1)
      this.addNewReaction(emoji, currentUserId);
  }

  getEmojiCount(currentUserId: string) {
    return this.reactions.filter((reaction: any) => (reaction.users.includes(currentUserId))).length;
  }

  getEmojiIndex(emoji: string) {
    return this.reactions.findIndex((reaction: any) => (reaction.id === emoji));
  }

  isEmojiAlreadyByMe(emoji: string, currentUserId: string) {
    return this.reactions.findIndex((reaction: any) => (reaction.id === emoji && reaction.users.includes(currentUserId))) != -1;
  }

  removeReaction(currentUserId: string, emojiIndex: number) {
    let index = this.reactions[emojiIndex].users.indexOf(currentUserId);
    this.reactions[emojiIndex].users.splice(index, 1);
    if (this.reactions[emojiIndex].users.length == 0) {
      this.reactions.splice(emojiIndex, 1);
    }
  }

  addNewReaction(emoji: string, currentUserId: string) {
    this.reactions.push({
      id: emoji,
      users: [currentUserId]
    });
  }

  addCurrentUserToReaction(emojiIndex: number, currentUserId: string) {
    this.reactions[emojiIndex].users.push(currentUserId);
  }


}
