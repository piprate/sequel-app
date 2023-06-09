import PostOptionsDialog from '../components/PostOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showPostOptionsDialog(post) {
  return showDialog(PostOptionsDialog, {
    label: 'intl.postOptions',
    title: '',
    post: post
  })
}
