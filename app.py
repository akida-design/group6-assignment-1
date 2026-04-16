from flask import Flask, request, jsonify

app = Flask(__name__)

# CLASS
class Student:   #mapped to database table
    def __init__(self, id, name,course=None ):
        self.id=id
        self.name=name
        self.course=course

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "course": self.course
        }

# data holder
students = [
     Student(1, "Akida Mwaura", "Software Development"),
     Student(2, "Mike John", "SCyber Security")
]


#  CRUD students
# Create
@app.route('/student', methods=["POST"])
def create_student():
    data = request.json

    new_student = Student(id=data["id"], name=data["name"], course=data["course"])
    students.append(new_student)
    return  jsonify( new_student.to_dict() ), 201

# get 
@app.route('/students')
def fetch_students():
    return jsonify( [student.to_dict() for student in students] )


# dynamic routes
# UPDATE, DELETE, GET individual learner