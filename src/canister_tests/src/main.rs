
mod backend;
mod util;
mod test;

#[tokio::main]
async fn main() {
    /*let handle = std::thread::spawn(||{
        loop {
            match Pin::new(&backend::test_backend()).poll(){
                Poll::Ready(_) => break,
                Poll::Pending => continue,
            }
        }
    });

    handle.join().unwrap();*/

    let agent = util::build_agent().await;
    if backend::test_backend(agent).await{
        println!("All tests successful ✅");
    } else {
        println!("Fail ❌");
    }
}
