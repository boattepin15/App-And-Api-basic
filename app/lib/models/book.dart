class Book {
  late int id;
  late String title;
  late String author_id;

  Book({required this.id, required this.title, required this.author_id});

  Book.fromJSON(Map<String, dynamic> json) {
    this.id = json["id"];
    this.title = json["title"];
    this.author_id = json["author_id"];
  }
}
