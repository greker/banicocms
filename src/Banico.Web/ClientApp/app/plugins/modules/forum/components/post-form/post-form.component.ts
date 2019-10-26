import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../../shared/services/auth.service";
import { ForumPostService } from "../../services/post.service";
import { Post } from "../../entities/post";

@Component({
  selector: "app-plugins-forum-post-form",
  templateUrl: "./post-form.component.html",
  styleUrls: ["./post-form.component.scss"]
})
export class ForumPostFormComponent implements OnInit {
  private post: Post;
  public isEdit: boolean = false;
  public username: string;
  public avatarHash: string;

  public postForm: FormGroup = this.fb.group({
    id: ["", Validators.required],
    topicId: ["", Validators.required],
    text: ["", Validators.required]
  });

  constructor(
    private postService: ForumPostService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.username = this.authService.getUserName();
    this.avatarHash = this.authService.getAvatarHash();
    this.post = new Post(null);
  }

  @Input()
  set topicId(topicId: string) {
    this.postForm.patchValue({
      topicId: topicId
    });
  }

  @Input()
  set id(id: string) {
    this.postService.get(id).subscribe(post => this.set(post));
  }

  @Output() saved: EventEmitter<Post> = new EventEmitter<Post>();
  @Output() cancelled: EventEmitter<null> = new EventEmitter<null>();

  private set(post: Post) {
    this.postForm.patchValue({
      id: post.id,
      topicId: post.topicId,
      text: post.text
    });
    this.post = post;
    this.isEdit = true;
  }

  public save() {
    // this.isRequesting = true;
    var id = this.postForm.value["id"];
    var topicId = this.postForm.value["topicId"];
    var text = this.postForm.value["text"];

    this.post.id = id;
    this.post.topicId = topicId;
    this.post.text = text;
    this.post.userId = this.authService.getUserId();
    this.post.username = this.authService.getUserName();

    this.postService.addOrUpdate(id, topicId, text).subscribe(
      id => {
        this.saved.emit(this.post);
      }
      //errors =>  //this.errors = errors
    );
  }

  public cancel() {
    this.cancelled.emit();
  }
}
