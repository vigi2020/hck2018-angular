import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();
    private url = 'http://54.173.104.49:3000/api';

    constructor(private http: HttpClient) { }

    getPosts() {
        this.http.get<{ message: string, posts: Post[] }>(this.url + '/posts')
            .subscribe((postData) => {
                this.posts = postData.posts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(post: Post) {
        this.http.post<{ message: string, postId: string }>(this.url + '/posts', post)
            .subscribe((responseData) => {
                console.log(responseData.message);
                post.id = responseData.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }

    deletePost(postId: string) {
        this.http.delete(this.url + '/posts/' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

}