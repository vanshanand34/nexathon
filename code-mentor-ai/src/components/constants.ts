export const LANGUAGES: Record<string, string> = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    cpp: "1.1.1",
  };
  
  export const DEFAULT_CODE_SNIPPETS: Record<string, string> = {
    javascript: `
  function greet(name) {
    console.log("Hello " + name + "!");
  }
  greet("Vansh");
  `,
    python: `
  def greet(name):
    print("hello " + name + "!")
    
  greet("Vansh")
  `,
    typescript: `
  type Params = {
    name: string
  }
  
  function greet(name: Params) {
    console.log("Hello " + name + "!");
  }
  greet({ name: "Vansh" });
  `,
    cpp: `
  #include<iostream>
  using namespace std;
  
  void greet(string name) {
    cout << "hello " << name << "!" << endl;
  }
  
  int main() {
    greet("Vansh");
    return 0;
  }
  `,
  };
  