import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class ApplicationController extends Controller {
  queryParams = ["category", "tags"];
  @tracked category;
  @tracked tags;
  // Cant use @tracked tags = []; because of https://github.com/emberjs/ember.js/issues/19078
}
