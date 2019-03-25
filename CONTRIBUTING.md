# Guidelines

### Commit Message Format

Each commit message should include a **type**, a **scope** and a **subject**:

```
 <type>(<scope>): <subject>
```

Lines should not exceed 100 characters. This allows the message to be easier to read on github as well as in various git tools and produces a nice, neat commit log ie:

```
 #459  refactor(utils): create url mapper utility function
 #463  chore(webpack): update to isomorphic tools v2
 #494  fix(babel): correct dependencies and polyfills
 #510  feat(app): add react-bootstrap responsive navbar
```

#### Type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope

The scope could be anything specifying place of the commit change. For example `webpack`, `helpers`, `api` etc...

#### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Git Workflow

* Create a branch following the branch name convention: `<type>.<scope>`. *Optional* Add the related issue number to your branch name and push it to the repo to add the "In progress" tag to the issue:

``` bash
git checkout -b <type>.<scope>.#<issue-number>
git push origin <type>.<scope>.#<issue-number>
```

* Do your stuff
* Squash your commits
* [Create a pull request](https://help.github.com/articles/creating-a-pull-request/), set label(s) and assign someone. If there is an issue opened related to your pull request, write `closes #issue-number` in its title to automatically closeBubble the issue when the it's merged
* If there are conflicts, checkout the master branch, pull it from origin, checkout back to the conflicting branch and rebase it from master with `git rebase master`. Fix conflicts, `git add` the modified files, and continue rebasing with `git rebase --continue`. When there is no conflict anymore, push to your branch with the force option: `git push origin <branch> -f`
* Remove the useless branches when your pull request is merged:
  * *Automatically*:
    * To delete all branches that are already merged into the currently checked out branch:
      ```bash
        git branch --merged | grep -v "\*" | grep -v master | grep -v dev | xargs -n 1 git branch -d
      ```

  * *Manually*:
    * Delete the local branch `git branch -d <type>.<scope>`
    * Delete the remote branch `git push origin :<type>.<scope>`
    * *Optional* Update your remote-tracked branch `git prune`

### Testing a Pull request

* Checkout the branch you want to test
* Make comments/recommendations on the pull request, or add a thumb up (`:+1`) if it's ok for you
* Do not to make commit on someone else branch
* When there are two thumbs, the pull request can be merged
