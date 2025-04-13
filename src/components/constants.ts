export const LANGUAGES: Record<string, string> = {
  javascript: "1.32.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "5.0.201",
  cpp: "10.2.0",
  typescript: "5.0.3",
  go: "1.16.2",
  php: "8.2.3",
  ruby: "3.0.1",
  swift: "5.3.3",
};
export const DEFAULT_CODE_SNIPPETS: Record<string, string> = {
  javascript: `
// JavaScript Example
function isEven(num) {
  return num % 2 === 0;
}

function printEvenNumbers(arr) {
  console.log("Running JavaScript function...");
  arr.forEach(n => {
    if (isEven(n)) {
      console.log(n + " is even");
    }
  });
}

const numbers = [1, 2, 3, 4, 5, 6];
printEvenNumbers(numbers);
`,

  python: `
# Python Example
def is_even(num):
    return num % 2 == 0

def print_even_numbers(arr):
    print("Running Python function...")
    for n in arr:
        if is_even(n):
            print(f"{n} is even")

numbers = [1, 2, 3, 4, 5, 6]
print_even_numbers(numbers)
`,

  java: `
// Java Example
public class Main {
  public static void main(String[] args) {
    System.out.println("Running Java function...");
    int[] numbers = {1, 2, 3, 4, 5, 6};
    printEvenNumbers(numbers);
  }

  static void printEvenNumbers(int[] arr) {
    for (int n : arr) {
      if (n % 2 == 0) {
        System.out.println(n + " is even");
      }
    }
  }
}
`,

  csharp: `
// C# Example
using System;

class Program {
  static void Main() {
    Console.WriteLine("Running C# function...");
    int[] numbers = {1, 2, 3, 4, 5, 6};
    PrintEvenNumbers(numbers);
  }

  static void PrintEvenNumbers(int[] arr) {
    foreach (int n in arr) {
      if (n % 2 == 0) {
        Console.WriteLine(n + " is even");
      }
    }
  }
}
`,

  cpp: `
// C++ Example
#include <iostream>
#include <vector>
using namespace std;

bool isEven(int num) {
  return num % 2 == 0;
}

void printEvenNumbers(const vector<int>& arr) {
  cout << "Running C++ function..." << endl;
  for (int n : arr) {
    if (isEven(n)) {
      cout << n << " is even" << endl;
    }
  }
}

int main() {
  vector<int> numbers = {1, 2, 3, 4, 5, 6};
  printEvenNumbers(numbers);
  return 0;
}
`,

  typescript: `
// TypeScript Example
type Params = number[];

function isEven(num: number): boolean {
  return num % 2 === 0;
}

function printEvenNumbers(arr: Params): void {
  console.log("Running TypeScript function...");
  arr.forEach(n => {
    if (isEven(n)) {
      console.log(n + " is even");
    }
  });
}

const numbers = [1, 2, 3, 4, 5, 6];
printEvenNumbers(numbers);
`,

  go: `
// Go Example
package main

import "fmt"

func isEven(n int) bool {
  return n%2 == 0
}

func printEvenNumbers(arr []int) {
  fmt.Println("Running Go function...")
  for _, n := range arr {
    if isEven(n) {
      fmt.Printf("%d is even\\n", n)
    }
  }
}

func main() {
  numbers := []int{1, 2, 3, 4, 5, 6}
  printEvenNumbers(numbers)
}
`,

  php: `
<?php
// PHP Example
function isEven($num) {
  return $num % 2 === 0;
}

function printEvenNumbers($arr) {
  echo "Running PHP function...\\n";
  foreach ($arr as $n) {
    if (isEven($n)) {
      echo "$n is even\\n";
    }
  }
}

$numbers = [1, 2, 3, 4, 5, 6];
printEvenNumbers($numbers);
?>
`,

  ruby: `
# Ruby Example
def is_even(num)
  num % 2 == 0
end

def print_even_numbers(arr)
  puts "Running Ruby function..."
  arr.each do |n|
    puts "#{n} is even" if is_even(n)
  end
end

numbers = [1, 2, 3, 4, 5, 6]
print_even_numbers(numbers)
`,

  swift: `
// Swift Example
func isEven(_ num: Int) -> Bool {
  return num % 2 == 0
}

func printEvenNumbers(_ arr: [Int]) {
  print("Running Swift function...")
  for n in arr {
    if isEven(n) {
      print("\\(n) is even")
    }
  }
}

let numbers = [1, 2, 3, 4, 5, 6]
printEvenNumbers(numbers)
`,
};
