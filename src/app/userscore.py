from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# 数据库配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 用户模型定义
class User(db.Model):
    __tablename__ = 'users'

    num = db.Column(db.Integer,  autoincrement=True)
    userId = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    score = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'userId': self.userId,
            'score': self.score
        }

# 创建数据库和表
with app.app_context():
    if User.query.count() == 0:  # 如果表是空的，则添加初始数据
        initial_users = [
            User(userId=1, score=75),
            User(userId=2, score=85),
            User(userId=3, score=95),
        ]
        db.session.add_all(initial_users)
        db.session.commit()


@app.route('/GetScore/<int:userId>', methods=['GET'])
def get_score(userId):
    user = User.query.filter_by(userId=userId).first()
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/UpdateScore', methods=['PUT'])
def update_score():
    data = request.get_json()
    userId = data.get('userId')
    score = data.get('score')

    if userId is None or score is None:
        return jsonify({'error': 'Invalid data'}), 400

    user = User.query.filter_by(userId=userId).first()
    if user:
        user.score = score
        db.session.commit()
        return jsonify({
            'message': 'Score updated successfully',
            'userId': userId,
            'new_score': score
        }), 200
    else:
        return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
