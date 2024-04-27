import 'package:app/login.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' as convert;
import 'package:shared_preferences/shared_preferences.dart';

import 'models/book.dart';
import 'models/user.dart';

final url = "http://localhost:5050";

class BookScreen extends StatefulWidget {
  BookScreen({
    Key? key,
  }) : super(key: key);

  @override
  _BookScreenState createState() => _BookScreenState();
}

class _BookScreenState extends State<BookScreen> {
  final List<Book> books = [];
  final titleController = TextEditingController();
  late User user = User();

  fetchBooks() async {
    setState(() {
      books.clear();
    });

    final token = await getToken();

    final res = await http.get(
      Uri.parse("$url/books"),
      headers: {
        "Accept": "application/json",
        "Access-Control_Allow_Origin": "*",
        "Authorization": "Bearer $token"
      },
    );

    final data = convert.jsonDecode(res.body) as List<dynamic>;
    for (var book in data) {
      final _book = Book.fromJSON(book as Map<String, dynamic>);
      setState(() {
        books.add(_book);
      });
    }
  }

  createBook() async {
    final token = await getToken();
    await http.post(
      Uri.parse("$url/create_book"),
      headers: {
        'content-type': 'application/json',
        "Authorization": "Bearer $token"
      },
      body: convert.jsonEncode({
        "title": titleController.text,
        "author_id": user.id,
      }),
    );

    titleController.text = "";

    fetchBooks();
  }

  fetchProfile() async {
    final token = await getToken();
    final res = await http.get(
      Uri.parse("$url/me"),
      headers: {
        "Accept": "application/json",
        "Access-Control_Allow_Origin": "*",
        "Authorization": "Bearer $token"
      },
    );
    final data = convert.jsonDecode(res.body) as Map<String, dynamic>;
    setState(() {
      user = User.fromJSON(data);
    });
  }

  getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("auth_token");
    return token;
  }

  logout() async {
    final token = await getToken();
    await http.delete(
      Uri.parse("$url/logout"),
      headers: {
        'content-type': 'application/json',
        "Authorization": "Bearer $token"
      },
    );

    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove("auth_token");

    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()),
    );
  }

  @override
  void initState() {
    fetchBooks();
    fetchProfile();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Book Management"),
        actions: [
          IconButton(
            onPressed: logout,
            icon: Icon(Icons.delete),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Flexible(
                    child: TextField(
                      controller: titleController,
                      decoration: InputDecoration(
                        labelText: "Book title",
                      ),
                    ),
                  ),
                  SizedBox(width: 24),
                  Text("Logged in by ${user.username}"),
                  SizedBox(width: 24),
                  IconButton(
                    onPressed: createBook,
                    icon: Icon(Icons.add),
                  ),
                ],
              ),
              SizedBox(height: 24),
              Text(
                "Books",
                style: TextStyle(
                  fontSize: 24,
                ),
              ),
              for (var book in books)
                BookCard(
                  title: titleController.text,
                  book: book,
                  refetch: fetchBooks,
                  user: user,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class BookCard extends StatefulWidget {
  BookCard({
    Key? key,
    required this.title,
    required this.book,
    required this.refetch,
    required this.user,
  }) : super(key: key);

  late Function refetch;
  late String title;
  late Book book;
  late User user;

  @override
  _BookCardState createState() => _BookCardState();
}

class _BookCardState extends State<BookCard> {
  bool isEdit = false;
  final editTitleController = TextEditingController();

  deleteBook(int id) async {
    final token = await getToken();
    await http.delete(
      Uri.parse("$url/delete_book/$id"),
      headers: {"Authorization": "Bearer $token"},
    );

    widget.refetch();
  }

  updateBook(String title) async {
    final token = await getToken();
    await http.patch(
      Uri.parse("$url/update_book/${widget.book.id}"),
      headers: {
        'content-type': 'application/json',
        "Authorization": "Bearer $token"
      },
      body: convert.jsonEncode({
        "title": title,
      }),
    );
    widget.refetch();
  }

  getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("auth_token");
    return token;
  }

  fetchBookById(int id) async {
    final token = await getToken();
    final res = await http.get(
      Uri.parse("$url/books/$id"),
      headers: {
        "Accept": "application/json",
        "Access-Control_Allow_Origin": "*",
        "Authorization": "Bearer $token"
      },
    );
    final data = convert.jsonDecode(res.body) as Map<String, dynamic>;
    final book = Book.fromJSON(data);

    showDialog(
      context: context,
      builder: (context) => SimpleDialog(
        children: [
          Center(child: Text("${book.title}")),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Container(
        margin: EdgeInsets.symmetric(vertical: 12),
        child: isEdit
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: editTitleController,
                  ),
                ],
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.book.title,
                    style: TextStyle(
                      fontSize: 20,
                    ),
                  ),
                  Text(widget.book.author_id.toString()),
                ],
              ),
      ),
      trailing: Wrap(
        children: [
          IconButton(
            onPressed: () {
              fetchBookById(widget.book.id);
            },
            icon: Icon(Icons.view_agenda),
          ),
          IconButton(
              onPressed: () {
                if (int.parse(widget.book.author_id) != widget.user.id) return;
                setState(() {
                  isEdit = !isEdit;
                  if (isEdit) {
                    editTitleController.text = widget.book.title;
                  } else {
                    updateBook(
                      editTitleController.text,
                    );
                  }
                });
              },
              icon: Icon(Icons.edit)),
          IconButton(
              onPressed: () {
                if (int.parse(widget.book.author_id) != widget.user.id) return;
                deleteBook(widget.book.id);
              },
              icon: Icon(Icons.delete)),
        ],
      ),
    );
  }
}
