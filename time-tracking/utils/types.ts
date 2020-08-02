export interface Attribute {
  id?: string;
  title?: string;
  project?: string;
}

export interface Timer {
  title: string;
  project: string;
  id: string;
  elapsed: number;
  isRunning: boolean;
}
