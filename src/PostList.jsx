import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";


export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [thread, setThread] = useState(null);
    const [post, setPost] = useState("");
    const [page, setPage] = useState(1); // ← ページ番号
    const { thread_id } = useParams(); // ← スレッドID取得
    const POSTS_PER_PAGE = 10;

     //スレッド情報の取得
    useEffect(() => {
        fetch(`https://railway.bulletinboard.techtrain.dev/threads`)
            .then(res => {
            console.log("fetch status:", res.status);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
            })
            .then(data =>  {
            console.log(data); // レスポンスの中身を確認
            // thread_idに一致するスレッドだけセット
            const thread = data.find(t => t.id === thread_id);
            setThread(thread || null);
            })
            .catch(err => console.error(err));
    }, [thread_id]);   
    

    //投稿一覧を取得する
    useEffect(()=>{
        fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts?offset=${(page - 1) * POSTS_PER_PAGE + 1}`)
            .then(res => res.json())
            .then(data => {
                console.log("posts api response:", data);
                setPosts(Array.isArray(data.posts) ? data.posts : [])
            })
            .catch(err => console.error(err));
    }, [thread_id, page]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // 必要に応じてバリデーション
        if (!post) {
            alert("投稿内容を入力してください");
            return;
        }

        const body = {post};

    
        const res = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            alert("投稿を作成しました");
            setPost("");// 入力欄リセット
            // サーバーから最新の投稿一覧を取得
            /*以下のやり方はローカルの情報を取得してしまう
            const newPost = await res.json(); // 新しい投稿データを取得
            setPosts(prev => [newPost, ...prev]); // 先頭に追加
            */
            fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts?offset=0`)
                .then(res => res.json())
                .then(data => {
                    setPosts(Array.isArray(data.posts) ? data.posts : []);
                })
                .catch(err => console.error(err));
            
        } else {
            alert("投稿に失敗しました");
        }
    };

    return(
        <div>
            <h2 className="post-title">「{thread ? thread.title : "？？？"}」投稿一覧</h2>
        <div className="table_and_form">
            {/* まず投稿一覧テーブル */}
            <div className="postTableWrapper">
                {posts.length === 0 ? <p>このスレッドには投稿がありません</p>
                :
                <table className="postTable">
                    <tbody>
                        {posts.map((post, index) => (
                            <tr key={post.id}>
                                <td className="postTableRow">
                                    <div className="posts">{post.post}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                }
            </div>
            {/* 次に投稿フォーム */}
            <div className="postFormWrapper">
                <form className="postForm" onSubmit={handleSubmit}>
                    <div>
                        <textarea className="textForm" id="postForm" placeholder="投稿してみよう！" value={post} onChange={e => setPost(e.target.value)}/>
                    </div>
                    <div>
                        <button className="postForm_button" type="submit">投稿する</button>
                    </div>
                </form>
            </div>
        
            {/* ページ送りボタン */}
            <div style={{ marginTop: "1em" }} className="page">
                <button
                    className="pageButton"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    前へ
                </button>
                <span style={{ margin: "0 1em" }}>ページ {page}</span>
                <button
                    className="pageButton"
                    onClick={() => setPage(page + 1)}
                    disabled={posts.length < POSTS_PER_PAGE}
                >
                    次へ
                </button>
            </div>
        </div>
    </div>
    );
}