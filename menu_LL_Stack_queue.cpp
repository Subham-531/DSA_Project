#include <iostream>
using namespace std;

struct Node {
  int data;
  Node *next;
};
Node *head = NULL;

void begining(int val) {
  Node *newNode = new Node();
  newNode->data = val;
  newNode->next = head;
  head = newNode;
}

void end(int val) {
  Node *newNode = new Node();
  newNode->data = val;
  newNode->next = NULL;
  if (head == NULL) {
    head = newNode;
    return;
  }
  Node *temp = head;
  while (temp->next != NULL)
    temp = temp->next;
  temp->next = newNode;
}

void deletebegining() {
  if (head == NULL) {
    cout << "List is empty\n";
    return;
  }
  Node *temp = head;
  head = head->next;
  delete temp;
}

void deleteend() {
  if (head == NULL) {
    cout << "List is empty\n";
    return;
  }
  if (head->next == NULL) {
    delete head;
    head = NULL;
    return;
  }
  Node *temp = head;
  while (temp->next->next != NULL)
    temp = temp->next;
  delete temp->next;
  temp->next = NULL;
}

void display() {
  Node *temp = head;
  while (temp != NULL) {
    cout << temp->data << " -> ";
    temp = temp->next;
  }
  cout << "NULL\n";
}

#define a 10
int arr[a];
int top = -1;

void push(int val) {
  if (top == a - 1) {
    cout << "Stack Overflow.\n";
    return;
  }
  arr[++top] = val;
}

void pop() {
  if (top == -1) {
    cout << "Stack Underflow.\n";
    return;
  }
  cout << "Popped: " << arr[top--] << endl;
}

void displayStack() {
  if (top == -1) {
    cout << "Stack is empty\n";
    return;
  }
  for (int i = top; i >= 0; i--)
    cout << arr[i] << " ";
  cout << endl;
}

int arr1[a];
int front = -1, rear = -1;

void enqueue(int val) {
  if (rear == a - 1) {
    cout << "Queue Full\n";
    return;
  }
  if (front == -1)
    front = 0;
  arr1[++rear] = val;
}

void dequeue() {
  if (front == -1 || front > rear) {
    cout << "Queue Empty\n";
    return;
  }
  cout << "Dequeued: " << arr1[front++] << endl;
}

void displayQueue() {
  if (front == -1 || front > rear) {
    cout << "Queue is empty\n";
    return;
  }
  for (int i = front; i <= rear; i++)
    cout << arr1[i] << " ";
  cout << endl;
}

int main() {
  int choice, val;
  while (1) {
    cout << "\n========== MAIN MENU ==========\n";
    cout << "1. Linked List\n";
    cout << "2. Stack\n";
    cout << "3. Queue\n";
    cout << "4. Exit\n";
    cout << "Enter choice: ";
    cin >> choice;
    switch (choice) {
    case 1: {
      int ch;
      cout << "\n-------- Linked List --------\n";
      cout << "1. Insert at Beginning of Linked List.\n";
      cout << "2. Insert at End of Linked List.\n";
      cout << "3. Delete from Beginning.\n";
      cout << "4. Delete from End.\n";
      cout << "5. Display the Linked List.\n";
      cout << "6. Exit.\n";
      cout << "Enter choice: ";
      cin >> ch;
      switch (ch) {
      case 1:
        cout << "Enter value to add at the begining: ";
        cin >> val;
        begining(val);
        break;
      case 2:
        cout << "Enter value to add at the end: ";
        cin >> val;
        end(val);
        break;
      case 3:
        deletebegining();
        break;
      case 4:
        deleteend();
        break;
      case 5:
        display();
        break;
      case 6:
        break;
      default:
        cout << "Invalid choice\n";
        break;
      }
      break;
    }
    case 2: {
      int ch;
      cout << "\n-------- Stack ---------\n";
      cout << "1. Push\n";
      cout << "2. Pop\n";
      cout << "3. Display\n";
      cout << "4. Exit\n";
      cout << "Enter choice: ";
      cin >> ch;
      switch (ch) {
      case 1:
        cout << "Enter value to add in stack: ";
        cin >> val;
        push(val);
        break;
      case 2:
        pop();
        break;
      case 3:
        displayStack();
        break;
      case 4:
        break;
      default:
        cout << "Invalid choice\n";
        break;
      }
      break;
    }
    case 3: {
      int ch;
      cout << "\n-------- Queue --------\n";
      cout << "1. Enqueue\n";
      cout << "2. Dequeue\n";
      cout << "3. Display\n";
      cout << "4. Exit\n";
      cout << "Enter choice: ";
      cin >> ch;
      switch (ch) {
      case 1:
        cout << "Enter value to add in queue: ";
        cin >> val;
        enqueue(val);
        break;
      case 2:
        dequeue();
        break;
      case 3:
        displayQueue();
        break;
      case 4:
        break;
      default:
        cout << "Invalid choice\n";
        break;
      }
      break;
    }
    case 4:
      cout << "Program Exited Successfully...\n";
      return 0;
    default:
      cout << "Invalid choice\n";
      break;
    }
  }
  return 0;
}