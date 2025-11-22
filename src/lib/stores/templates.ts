export interface Template {
	id: string;
	name: string;
	description: string;
	code: string;
	category: string;
}

export const templates: Template[] = [
	{
		id: 'flowchart-basic',
		name: 'Basic Flowchart',
		description: 'A simple flowchart example',
		category: 'Flowchart',
		code: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`
	},
	{
		id: 'sequence-basic',
		name: 'Sequence Diagram',
		description: 'A basic sequence diagram',
		category: 'Sequence',
		code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B->>A: Hello Alice!
    A->>B: How are you?
    B->>A: I'm good, thanks!`
	},
	{
		id: 'class-basic',
		name: 'Class Diagram',
		description: 'A simple class diagram',
		category: 'Class',
		code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`
	},
	{
		id: 'state-basic',
		name: 'State Diagram',
		description: 'A basic state diagram',
		category: 'State',
		code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Failed: Error
    Failed --> Idle: Retry
    Success --> [*]`
	},
	{
		id: 'er-basic',
		name: 'ER Diagram',
		description: 'An entity relationship diagram',
		category: 'ER',
		code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
        int id
    }
    ORDER {
        int orderNumber
        date orderDate
    }
    LINE-ITEM {
        string productCode
        int quantity
    }`
	},
	{
		id: 'gantt-basic',
		name: 'Gantt Chart',
		description: 'A project timeline',
		category: 'Gantt',
		code: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements       :a1, 2024-01-01, 30d
    Design            :a2, after a1, 20d
    section Development
    Backend           :a3, 2024-02-01, 45d
    Frontend          :a4, after a3, 30d
    section Testing
    QA Testing        :a5, after a4, 15d`
	},
	{
		id: 'pie-basic',
		name: 'Pie Chart',
		description: 'A simple pie chart',
		category: 'Pie',
		code: `pie title Market Share
    "Product A" : 42.5
    "Product B" : 28.3
    "Product C" : 18.7
    "Others" : 10.5`
	},
	{
		id: 'journey-basic',
		name: 'User Journey',
		description: 'A user journey map',
		category: 'Journey',
		code: `journey
    title My Working Day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`
	}
];
