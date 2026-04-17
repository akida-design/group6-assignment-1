from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
    new_id = int(data["id"])
    for student in students:
        if student.id == new_id:
            return jsonify({"error": "Student ID already exists"}), 400

    new_student = Student(
        id=int(data["id"]),
        name=data["name"],
        course=data["course"]
    )
    students.append(new_student)

    return jsonify(new_student.to_dict()), 201
        

    

# get 
@app.route('/students')
def fetch_students():
    return jsonify( [student.to_dict() for student in students] )


# Edit. route
@app.route('/student/<int:id>', methods=["PUT"])
def edit_student(id):
    print(request)
    data = request.json
    print("user data", data)
    
    for student in students:
        if student.id == id:
            student.name = data.get('name', student.name)
            student.course = data.get('course', student.course)

            return jsonify(student.to_dict()), 200
        
    return jsonify({"error":"Student not found"}), 404
            
@app.route('/student/<int:id>', methods=["DELETE"])
def delete_student(id):
    new_id = int(id)

    for student in students:
        if student.id == new_id:
            students.remove(student)  # ✅ correct list
            return jsonify({"message": "Student deleted successfully"}), 200

    return jsonify({"error": "Student not found"}), 404
if __name__ == '__main__':
    app.run(debug=True)