class User {
  late int? id;
  late String? username;

  User({this.id, this.username});

  User.fromJSON(Map<String, dynamic> json) {
    this.id = json["id"];
    this.username = json["username"];
  }
}
