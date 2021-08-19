
mod backend;
mod util;

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

    if backend::test_backend().await{
        println!("All tests successful ✅");
    } else {
        println!("Fail ❌");
    }
}
