// デコレータ、Nuxtアプリケーションインスタンスをインポート
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'

// モジュールで使用する型を宣言
type Todo = {
  id: number
  title: string
  description: string
  done: boolean
}

@Module({
  name: 'todo',
  // Nuxt.jsのモジュールであることを宣言
  stateFactory: true,
  namespaced: true
})
export default class Todos extends VuexModule {
  private todos: Todo[] = []

  public get getTodos() {
    return this.todos
  }

  public get getTodo() {
    return (id: number) => this.todos.find((todo) => todo.id === id)
  }

  public get getTodoCount() {
    return this.todos.length
  }

  // Mutationsはactions経由での更新で統一する
  @Mutation
  private add(todo: Todo) {
    this.todos.push(todo)
  }

  @Mutation
  private remove(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id)
  }

  @Mutation
  private set(todos: Todo[]) {
    this.todos = todos
  }

  @Action({ rawError: true })
  public async fetchTodos() {
    const { data } = await $axios.get<Todo[]>('/api/todos')
    this.set(data)
  }

  @Action({ rawError: true })
  public async createTodo(payload: Todo) {
    const { data } = await $axios.post<Todo>('/api/todo', payload)
    this.add(data)
  }

  @Action({ rawError: true })
  public async deleteTodo(id: number) {
    await $axios.delete(`/api/todo/${id}`)
    this.remove(id)
  }
}
